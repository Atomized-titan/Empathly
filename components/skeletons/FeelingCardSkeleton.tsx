import React from 'react';

import { Skeleton } from '../ui/skeleton';

const FeelingCardSkeleton = () => {
  return (
    <article
      className={`flex w-full gap-6 flex-col rounded-xl bg-dark-2 p-7 border-dark-4 border`}
    >
      <div className='flex justify-between items-center'>
        <div className='flex flex-1 items-center gap-4'>
          <Skeleton className='h-12 w-12 rounded-full' />
          <div className='flex flex-1 flex-col gap-4'>
            <Skeleton className='h-4 w-[250px]' />
            <Skeleton className='h-4 w-[200px]' />
          </div>
        </div>
        <div className='hidden md:flex items-center gap-4'>
          <Skeleton className='h-4 w-12' />
          <Skeleton className='h-4 w-12' />
        </div>
      </div>
      <div className='text-light-2 bg-dark-3 p-4 rounded-xl'>
        <Skeleton className='h-4 w-[80%]' />
      </div>

      <div className='flex items-center gap-4 text-subtle-medium text-light-1 justify-between md:justify-normal'>
        <Skeleton className='h-4 w-12' />
        <Skeleton className='h-4 w-12' />
        <Skeleton className='h-4 w-12' />
        <Skeleton className='h-4 w-12' />
      </div>

      <div className='ml-1 mt-3 flex items-center gap-2'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-4 w-20' />
      </div>
    </article>
  );
};

export default FeelingCardSkeleton;
