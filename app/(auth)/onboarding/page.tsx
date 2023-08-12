import { currentUser } from '@clerk/nextjs';

import AccountProfile from '@/components/forms/AccountProfile';

async function Page() {
  const user = await currentUser();
  if (!user) return null; // to avoid typescript warnings

  const userInfo = {};
  const userData = {
    id: user.id,
    objectId: userInfo?._id,
    username: userInfo?.username || user.username,
    name: userInfo?.name || user.firstName || '',
    bio: userInfo?.bio || '',
    image: userInfo?.image || user.imageUrl,
    gender: userInfo?.gender || user.gender,
  };

  return (
    <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
      <h1 className='head-text text-light-1'>Onboarding</h1>
      <p className='mt-3 text-base-regular text-dark-5'>
        Step into the Empathly experience by taking a moment to complete your
        profile. Your insights and presence contribute to the supportive
        atmosphere we&apos;re building together.
      </p>

      <section className='mt-9 bg-dark-2 p-10 rounded-lg shadow-slate-700 shadow-lg'>
        <AccountProfile user={userData} btnTitle='Complete' />
      </section>
    </main>
  );
}

export default Page;
