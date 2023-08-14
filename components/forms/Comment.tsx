'use client';

import { z } from 'zod';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { usePathname } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';

import { Input } from '../ui/input';
import { Button } from '../ui/button';

import { CommentValidation } from '@/lib/validations/feeling';
import { addCommentToFeeling } from '@/lib/actions/feeling.action';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface Props {
  feelingId: string;
  currentUserImg: string;
  currentUserId: string;
}

function Comment({ feelingId, currentUserImg, currentUserId }: Props) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      feeling: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    setLoading(true);
    await addCommentToFeeling(
      feelingId,
      values.feeling,
      JSON.parse(currentUserId),
      pathname
    );
    setLoading(false);
    form.reset();
  };

  return (
    <Form {...form}>
      <form className='comment-form' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='feeling'
          render={({ field }) => (
            <FormItem className='flex w-full items-center gap-3'>
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt='current_user'
                  width={48}
                  height={48}
                  className='rounded-full object-cover'
                />
              </FormLabel>
              <FormControl className='border-none bg-transparent'>
                <Input
                  type='text'
                  {...field}
                  placeholder='Comment...'
                  className='no-focus text-light-1 outline-none'
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type='submit' className='comment-form_btn' disabled={loading}>
          {loading ? (
            <ArrowPathIcon className='w-5 h-5 animate-spin' />
          ) : (
            'Reply'
          )}
        </Button>
      </form>
    </Form>
  );
}

export default Comment;
