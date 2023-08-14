import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

import { fetchFeelingById } from '@/lib/actions/feeling.action';
import { fetchUser } from '@/lib/actions/user.action';

import FeelingCard from '@/components/cards/FeelingCard';
import Comment from '@/components/forms/Comment';

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  const feeling = await fetchFeelingById(params.id);

  return (
    <section className='relative'>
      <div>
        <FeelingCard
          key={feeling._id}
          id={feeling._id}
          currentUserObjectId={userInfo._id}
          likes={feeling.likes}
          image={feeling.image}
          currentUserId={user?.id || ''}
          parentId={feeling.parentId}
          content={feeling.text}
          author={feeling.author}
          community={feeling.community}
          createdAt={feeling.createdAt}
          comments={feeling.children}
        />
      </div>

      <div className='mt-7'>
        <Comment
          feelingId={feeling.id}
          currentUserImg={user.imageUrl}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className='mt-10'>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {feeling.children.map((childItem: any) => (
          <FeelingCard
            likes={childItem.likes}
            key={childItem._id}
            currentUserObjectId={userInfo._id}
            id={childItem._id}
            currentUserId={user.id}
            image={childItem.image}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
};

export default Page;
