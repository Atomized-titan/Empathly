import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

import { fetchUser, getActivity } from '@/lib/actions/users.action';
import { formatDateStringForMobile } from '@/lib/utils';

const PageActivityPage = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  const activity = await getActivity(userInfo._id);

  return (
    <section className='mt-10 flex flex-col gap-5'>
      {activity.length > 0 ? (
        <>
          {activity.map((activity) => (
            <Link key={activity._id} href={`/feeling/${activity.parentId.id}`}>
              <article className='activity-card'>
                <div className='flex items-center gap-3'>
                  <Image
                    src={activity.author.image}
                    alt='user_logo'
                    width={40}
                    height={40}
                    className='rounded-full object-cover'
                  />
                  <div className='flex flex-col gap-2'>
                    <p className='!text-base-regular text-dark-5'>
                      <span className='mr-1 text-primary'>
                        {activity.author.name}
                      </span>{' '}
                      <span>replied to your feeling</span>
                    </p>
                    <p className='!text-base-regular text-light-1'>
                      {activity.text}
                    </p>
                    <p className='!text-small-regular text-dark-5'>
                      {formatDateStringForMobile(activity.createdAt)}
                    </p>
                  </div>
                </div>
                <Image
                  src={activity.parentId.image}
                  alt='user_logo'
                  width={150}
                  height={150}
                  className='rounded-xl object-cover'
                />
              </article>
            </Link>
          ))}
        </>
      ) : (
        <p className='!text-base-regular text-light-3'>No activity yet</p>
      )}
    </section>
  );
};

export default PageActivityPage;
