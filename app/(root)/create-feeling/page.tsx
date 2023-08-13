import PostFeeling from '@/components/forms/PostFeeling';
import { fetchUser } from '@/lib/actions/users.actions';
import { currentUser, useClerk } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export async function Home() {
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

export default Home;
