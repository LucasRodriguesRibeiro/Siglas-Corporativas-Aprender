import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export interface AuthSession {
  username: string;
  email: string;
  loggedInAt: number;
}

const SESSION_KEY = "dicionario_auth_session";

export function getStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function saveStoredSession(username: string, email: string): AuthSession {
  const session: AuthSession = {
    username,
    email,
    loggedInAt: Date.now()
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function clearStoredSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// Helper function to convert username to email format
export function formatEmail(input: string): string {
  const trimmed = input.trim().toLowerCase();
  if (trimmed.includes("@")) {
    return trimmed;
  }
  return `${trimmed}@dicionario.com`;
}

// Single master credential defined for the platform
const MASTER_USER = "siglascorporativas";
const MASTER_PASS = "senhapadrao123";

export async function loginWithFirebase(usernameInput: string, passwordInput: string): Promise<{ username: string; email: string }> {
  const cleanUser = usernameInput.trim().toLowerCase();
  const cleanPass = passwordInput.trim();
  const email = formatEmail(cleanUser);

  // Check master user match
  const isMasterUser = (cleanUser === MASTER_USER || cleanUser === `${MASTER_USER}@dicionario.com`) && cleanPass === MASTER_PASS;

  try {
    // Attempt Firebase Auth sign-in
    await signInWithEmailAndPassword(auth, email, cleanPass);
    saveStoredSession(cleanUser, email);
    return { username: cleanUser, email };
  } catch (error: any) {
    console.warn("Firebase Auth signIn notice:", error?.code || error);

    // If account doesn't exist in Firebase yet, attempt to create it in Firebase Auth
    if (
      error.code === "auth/user-not-found" || 
      error.code === "auth/invalid-credential" ||
      error.code === "auth/invalid-email"
    ) {
      try {
        await createUserWithEmailAndPassword(auth, email, cleanPass);
        saveStoredSession(cleanUser, email);
        return { username: cleanUser, email };
      } catch (createErr: any) {
        console.warn("Firebase Auth createUser notice:", createErr?.code || createErr);
      }
    }

    // If master user matches, allow login seamlessly even if Firebase Auth Email Provider is disabled in console
    if (isMasterUser) {
      saveStoredSession(MASTER_USER, `${MASTER_USER}@dicionario.com`);
      return { username: MASTER_USER, email: `${MASTER_USER}@dicionario.com` };
    }

    // If master user entered wrong password
    if ((cleanUser === MASTER_USER || cleanUser === `${MASTER_USER}@dicionario.com`) && cleanPass !== MASTER_PASS) {
      throw new Error("Senha incorreta. Verifique suas credenciais.");
    }

    // Generic error message
    throw new Error(
      error.code === "auth/wrong-password"
        ? "Senha incorreta. Tente novamente."
        : "Usuário ou senha incorretos."
    );
  }
}

export async function logoutFirebase(): Promise<void> {
  clearStoredSession();
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.warn("Firebase signOut notice:", err);
  }
}

export { onAuthStateChanged, type User };

