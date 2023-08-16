import { currentUser } from '@clerk/nextjs';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { fetchBookmarks } from '@/lib/actions/bookmark.action';
import { fetchUser } from '@/lib/actions/user.action';

import FeelingCard from '@/components/cards/FeelingCard';

export const metadata: Metadata = {
  title: 'Bookmarks / Empathly',
  description: 'Bookmarks',
};

const Page = async () => {
  console.time('current user');
  const user = await currentUser();
  if (!user) return null;
  console.timeEnd('current user');

  console.time('fetch user');
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');
  console.timeEnd('fetch user');

  console.time('fetch bookmarks');
  const bookmarkedFeelings = await fetchBookmarks(userInfo._id);
  console.timeEnd('fetch bookmarks');

  return (
    <>
      <p className='text-small-medium text-gray-1 -mt-6'>@{user?.username}</p>
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
    </>
  );
};

export default Page;
