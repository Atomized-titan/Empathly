import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <section className='flex flex-col gap-6'>
      <p className='text-small-medium text-gray-1'>
        <Skeleton className='h-4 w-[100px] dark' />
      </p>
    </section>
  );
};

export default Loading;
