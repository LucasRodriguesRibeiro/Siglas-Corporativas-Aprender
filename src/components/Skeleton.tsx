import React from "react";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`bg-slate-200 dark:bg-slate-800 animate-pulse-soft rounded ${className}`} />
  );
}

export function SiglaCardSkeleton() {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="flex flex-wrap gap-1.5 pt-2">
        <Skeleton className="h-5 w-12 rounded" />
        <Skeleton className="h-5 w-16 rounded" />
        <Skeleton className="h-5 w-10 rounded" />
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex items-center space-x-2 pt-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
