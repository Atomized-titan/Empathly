import { fetchUser } from '@/lib/actions/users.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  return (
    <main>
      <h1 className='head-text'>Home</h1>
      {/* <div>
        <UserButton afterSignOutUrl='/' />
      </div> */}
    </main>
  );
}

export default Home;
