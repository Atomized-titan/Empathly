import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { fetchUser } from '@/lib/actions/user.action';

import PostFeeling from '@/components/forms/PostFeeling';

export async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect('/onboarding');

  return (
    <>
      <h1 className='head-text'>Create Feeling</h1>

      <PostFeeling userId={userInfo._id} />
    </>
  );
}

export default Page;
