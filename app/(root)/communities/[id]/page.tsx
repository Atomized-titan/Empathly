/* eslint-disable @typescript-eslint/ban-ts-comment */
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { fetchCommunityDetails } from '@/lib/actions/community.action';
import { fetchUser } from '@/lib/actions/user.action';

import UserCard from '@/components/cards/UserCard';
import CommunityProfileHeader from '@/components/common/CommunityProfileHeader';
import FeelingsTab from '@/components/common/FeelingsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { communityTabs } from '@/constants';

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  const communityDetails = await fetchCommunityDetails(params.id);

  const memberCount = communityDetails.members.length;

  const top5UserImages = communityDetails.members.map(
    (member: any) => member.image
  );

  return (
    <section className='relative'>
      <CommunityProfileHeader
        accountId={communityDetails.createdBy.id}
        authUserId={user.id}
        name={communityDetails.name}
        username={communityDetails.username}
        imgUrl={communityDetails.image}
        bio={communityDetails.bio}
        createdAt={communityDetails.createdAt}
        type='Community'
        memberCount={memberCount}
        top5UserImages={top5UserImages}
      />
      <div className='mt-9'>
        <Tabs defaultValue='feelings' className='w-full'>
          <TabsList className='tab'>
            {communityTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                <tab.icon className='w-4 h-4' />
                <p className='max-sm:hidden'>{tab.label}</p>

                {tab.label === 'Feelings' && (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {communityDetails.feelings.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value='feelings' className='w-full text-light-1'>
            {/* @ts-ignore */}
            <FeelingsTab
              currentUserId={user.id}
              accountId={communityDetails._id}
              accountType='Community'
              currentUserObjectId={userInfo._id}
            />
          </TabsContent>

          <TabsContent value='members' className='mt-9 w-full text-light-1'>
            <section className='mt-9 flex flex-col gap-10'>
              {communityDetails.members.map((member: any) => (
                <UserCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  username={member.username}
                  imgUrl={member.image}
                  personType='User'
                />
              ))}
            </section>
          </TabsContent>

          <TabsContent value='requests' className='w-full text-light-1'>
            {/* @ts-ignore */}
            <FeelingsTab
              currentUserId={user.id}
              accountId={communityDetails._id}
              accountType='Community'
              currentUserObjectId={userInfo._id}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Page;
