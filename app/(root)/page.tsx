import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { fetchFeelings } from '@/lib/actions/feeling.actions';
import { fetchUser } from '@/lib/actions/users.actions';

import FeelingCard from '@/components/cards/FeelingCard';

async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  const feelings = await fetchFeelings(1, 20);
  // console.log(feelings);
  return (
    <main>
      <h1 className='head-text'>Home</h1>
      <section className='mt-9 flex flex-col gap-10'>
        {feelings.posts.length === 0 ? (
          <div className='no-result'>No Results</div>
        ) : (
          <>
            {feelings.posts.map((post) => (
              <FeelingCard
                key={post._id}
                id={post._id}
                image={post.image}
                currentUserId={user?.id || ''}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </main>
  );
}

export default Home;
