import { redirect } from 'next/navigation';

import { fetchUserPosts } from '@/lib/actions/users.actions';

import FeelingCard from '../cards/FeelingCard';

interface Result {
  name: string;
  image: string;
  id: string;
  feelings: {
    _id: string;
    image: string;
    text: string;
    likes: string[];
    parentId: string | null;
    author: {
      name: string;
      image: string;
      id: string;
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    children: {
      author: {
        image: string;
      };
    }[];
  }[];
}

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
  currentUserObjectId: string;
}

async function FeelingsTab({
  currentUserId,
  accountId,
  accountType,
  currentUserObjectId,
}: Props) {
  let result: Result;

  //   if (accountType === "Community") {
  //     result = await fetchCommunityPosts(accountId);
  //   } else {
  result = await fetchUserPosts(accountId);
  //   }

  if (!result) {
    redirect('/');
  }

  return (
    <section className='mt-9 flex flex-col gap-10'>
      {result.feelings.map((feeling) => (
        <FeelingCard
          currentUserObjectId={currentUserObjectId}
          image={feeling.image}
          likes={feeling.likes}
          key={feeling._id}
          id={feeling._id}
          currentUserId={currentUserId}
          parentId={feeling.parentId}
          content={feeling.text}
          author={
            accountType === 'User'
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: feeling.author.name,
                  image: feeling.author.image,
                  id: feeling.author.id,
                }
          }
          community={
            accountType === 'Community'
              ? { name: result.name, id: result.id, image: result.image }
              : feeling.community
          }
          createdAt={feeling.createdAt}
          comments={feeling.children}
        />
      ))}
    </section>
  );
}

export default FeelingsTab;
