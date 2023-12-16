import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { fetchFeelings } from '@/lib/actions/feeling.action';
import { fetchUser } from '@/lib/actions/user.action';

import FeelingCard from '@/components/cards/FeelingCard';
import Pagination from '@/components/common/Pagination';

async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return redirect('/sign-in');

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  const feelings = await fetchFeelings(1, 20);
  console.log(feelings);
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
                currentUserObjectId={userInfo._id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
                likes={post.likes}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path='/'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={feelings.isNext}
      />
    </main>
  );
}

export default Home;
