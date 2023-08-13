import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { fetchUser } from '@/lib/actions/users.actions';

import FeelingsTab from '@/components/common/FeelingsTab';
import ProfileHeader from '@/components/common/ProfileHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { profileTabs } from '@/constants';

export async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(params.id);

  const authUserInfo = await fetchUser(user.id);

  console.log({ userInfo, authUserInfo });

  if (!userInfo?.onboarded) redirect('/onboarding');

  const isFollowing = userInfo.followers.some(
    (follower: { id: string }) => follower.id === user.id
  );

  const followersCount = userInfo.followers.length;

  const followingCount = userInfo.following.length;

  return (
    <>
      <section>
        <ProfileHeader
          accountId={userInfo.id}
          accountObjectId={userInfo._id}
          authUserId={user.id}
          authUserObjectId={authUserInfo._id}
          name={userInfo.name}
          username={userInfo.username}
          imgUrl={userInfo.image}
          bio={userInfo.bio}
          createdAt={user.createdAt}
          isFollowing={isFollowing}
          followersCount={followersCount}
          followingCount={followingCount}
        />

        <div className='mt-9'>
          <Tabs defaultValue='feelings' className='w-full'>
            <TabsList className='tab'>
              {profileTabs.map((tab) => (
                <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                  <tab.icon className='w-4 h-4 text-light-1' />
                  <p className='max-sm:hidden'>{tab.label}</p>

                  {tab.label === 'Feelings' && (
                    <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                      {userInfo.feelings.length}
                    </p>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            {profileTabs.map((tab) => (
              <TabsContent
                key={`content-${tab.label}`}
                value={tab.value}
                className='w-full text-light-1'
              >
                {/* @ts-ignore */}
                <FeelingsTab
                  currentUserId={user.id}
                  currentUserObjectId={userInfo._id}
                  accountId={userInfo.id}
                  accountType='User'
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </>
  );
}

export default Page;
