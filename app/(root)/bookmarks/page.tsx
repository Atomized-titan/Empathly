import { currentUser } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import React from 'react';

import { fetchBookmarks } from '@/lib/actions/bookmark.action';
import { fetchUser } from '@/lib/actions/user.action';

import FeelingCard from '@/components/cards/FeelingCard';

const Page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  revalidatePath('/bookmarks');

  const bookmarkedFeelings = await fetchBookmarks(userInfo._id);

  console.log({ bookmarkedFeelings });
  return (
    <section className='flex flex-col gap-6'>
      <div>
        <h1 className='head-text'>Bookmarks</h1>
        <p className='text-small-medium text-gray-1'>@{user?.username}</p>
      </div>
      <div className='flex flex-col gap-6'>
        {bookmarkedFeelings
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((feeling) => (
            <FeelingCard
              currentUserObjectId={userInfo._id}
              image={feeling.image}
              likes={feeling.likes}
              key={feeling._id}
              id={feeling._id}
              currentUserId={user.id}
              parentId={feeling.parentId}
              content={feeling.text}
              author={feeling?.author}
              community={feeling.community}
              createdAt={feeling.createdAt}
              comments={feeling.children}
              isBookMarkView
            />
          ))}
      </div>
    </section>
  );
};

export default Page;
