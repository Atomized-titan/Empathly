import { currentUser } from '@clerk/nextjs';
import { nanoid } from 'nanoid';

import { fetchUserOnly } from '@/lib/actions/user.action';
import { pusherServer } from '@/lib/pusher';
import { db } from '@/lib/redis';
import { toPusherKey } from '@/lib/utils';
import { Message, messageValidator } from '@/lib/validations/message';

export async function POST(req: Request) {
  try {
    console.log('API POST request received');
    const { text, chatId }: { text: string; chatId: string } = await req.json();
    console.log('Request JSON data:', { text, chatId });

    const user = await currentUser();

    if (!user) {
      console.log('Unauthorized: User not found');
      return new Response('Unauthorized', { status: 401 });
    }

    const [userId1, userId2] = chatId.split('--');

    if (user.id !== userId1 && user.id !== userId2) {
      console.log('Unauthorized: User is not part of the chat');
      return new Response('Unauthorized', { status: 401 });
    }

    const friendId = user.id === userId1 ? userId2 : userId1;
    console.log('User ID:', user.id);
    console.log('Friend ID:', friendId);

    const sender = await fetchUserOnly(user.id);
    console.log('Sender:', sender);

    const timestamp = Date.now();

    const messageData: Message = {
      id: nanoid(),
      senderId: user.id,
      text,
      timestamp,
    };
    console.log('Message data:', messageData);

    const message = messageValidator.parse(messageData);
    console.log('Parsed message:', message);

    // notify all connected chat room clients
    await pusherServer.trigger(
      toPusherKey(`chat:${chatId}`),
      'incoming-message',
      message
    );

    await pusherServer.trigger(
      toPusherKey(`user:${friendId}:chats`),
      'new_message',
      {
        ...message,
        senderImg: sender.image,
        senderName: sender.name,
      }
    );

    // all valid, send the message
    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new Response('OK');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
      return new Response(error.message, { status: 500 });
    }

    console.error('Unknown error occurred');
    return new Response('Internal Server Error', { status: 500 });
  }
}
