import React from 'react';

import FeelingCardSkeleton from '@/components/skeletons/FeelingCardSkeleton';

const Loading = () => {
  return (
    <div>
      {' '}
      <div className='flex flex-col gap-6'>
        <FeelingCardSkeleton />
        <FeelingCardSkeleton />
      </div>
    </div>
  );
};

export default Loading;
