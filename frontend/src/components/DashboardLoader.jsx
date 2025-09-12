import React from 'react';
import { Skeleton } from '~/components/ui/skeleton';

const DashboardLoader = () => {
  return (
    <div className="p-4 md:p-8">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Balance Summary Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
      </div>

      {/* Expense List Skeleton */}
      <div>
        <Skeleton className="h-8 w-56 mb-4" />
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-800 p-4 rounded-lg">
            <div>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-52" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="flex justify-between items-center bg-slate-800 p-4 rounded-lg">
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="flex justify-between items-center bg-slate-800 p-4 rounded-lg">
            <div>
              <Skeleton className="h-6 w-44 mb-2" />
              <Skeleton className="h-4 w-56" />
            </div>
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLoader;