import React from 'react';

export default function BookmarkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='flex flex-col gap-6'>
      <div>
        <h1 className='head-text'>Bookmarks</h1>
      </div>
      <div className='flex flex-col gap-6'>{children}</div>
    </section>
  );
}
