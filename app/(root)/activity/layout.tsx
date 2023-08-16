import React from 'react';

export default function BookmarkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='flex flex-col gap-6'>
      <div>
        <h1 className='head-text'>Activity</h1>
      </div>
      <section className='mt-10 flex flex-col gap-5'>{children}</section>
    </section>
  );
}
