import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { fetchUser } from '@/lib/actions/users.actions';

import PostFeeling from '@/components/forms/PostFeeling';
import ProfileHeader from '@/components/common/ProfileHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { profileTabs } from '@/constants';
import Image from 'next/image';
import FeelingsTab from '@/components/common/FeelingsTab';

export async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(params.id);

  if (!userInfo?.onboarded) redirect('/onboarding');

  return (
    <>
      <section>
        <ProfileHeader
          accountId={userInfo.id}
          authUserId={user.id}
          name={userInfo.name}
          username={userInfo.username}
          imgUrl={userInfo.image}
          bio={userInfo.bio}
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
