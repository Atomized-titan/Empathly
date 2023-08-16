import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <>
      <h1 className='head-text'>
        <Skeleton className='h-8 w-40' />
      </h1>

      <section className='mt-10 flex flex-col gap-5'>
        {/* Skeleton for each activity card */}
        <article className='activity-card'>
          <div className='flex items-center gap-3'>
            <Skeleton className='h-12 w-12 rounded-full' />
            <div className='flex flex-col gap-2'>
              <Skeleton className='h-4 w-[80%]' />
              <Skeleton className='h-4 w-[100%]' />
            </div>
          </div>
          <Skeleton className='h-32 w-32 rounded-xl' />
        </article>

        {/* More skeleton activity cards */}
        <article className='activity-card'>
          {/* Skeleton content for each activity card */}
        </article>
      </section>
    </>
  );
};

export default Loading;
