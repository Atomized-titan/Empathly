import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Message } from 'react-hook-form';

import { fetchUserOnly } from '@/lib/actions/user.action';
import { messageArrayValidator } from '@/lib/validations/message';

import ChatInput from '@/components/common/ChatInput';
import Messages from '@/components/common/Messages';

import { fetchRedis } from '@/helpers/redis';

async function getChatMessages(chatId: string) {
  try {
    const results: string[] = await fetchRedis(
      'zrange',
      `chat:${chatId}:messages`,
      0,
      -1
    );

    const dbMessages = results.map((message) => JSON.parse(message) as Message);

    const reversedDbMessages = dbMessages.reverse();

    const messages = messageArrayValidator.parse(reversedDbMessages);

    return messages;
  } catch (error) {
    notFound();
  }
}
interface PageProps {
  params: {
    chatId: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { chatId } = params;

  const user = await currentUser();
  if (!user) return null;

  const [receiverId, senderId] = chatId.split('--');

  const partnerInfo = await fetchUserOnly(receiverId);

  // const chatPartnerId = user.id === receiverId ? senderId : receiverId;
  console.log(senderId);

  const initialMessages = await getChatMessages(chatId);

  return (
    <div>
      <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
        <div className='relative flex items-center space-x-4'>
          <div className='relative'>
            <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
              <Image
                fill
                referrerPolicy='no-referrer'
                src={partnerInfo.image}
                alt={`${partnerInfo.name} profile picture`}
                className='rounded-full'
              />
            </div>
          </div>

          <div className='flex flex-col leading-tight'>
            <div className='text-xl flex items-center'>
              <span className='text-light-1 mr-3 font-semibold'>
                {partnerInfo.name}
              </span>
            </div>

            <span className='text-sm text-gray-600'>
              @{partnerInfo.username}
            </span>
          </div>
        </div>
      </div>
      <Messages
        chatId={chatId}
        chatPartnerImage={partnerInfo.image}
        sessionImg={user.imageUrl}
        sessionId={user.id}
        initialMessages={initialMessages}
      />

      <ChatInput chatId={chatId} partnerName={partnerInfo.name} />
    </div>
  );
};

export default page;
