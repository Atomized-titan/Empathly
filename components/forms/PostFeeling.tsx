'use client';

import React from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Gender, UserValidation } from '@/lib/validations/user';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { animated, config, useSpring } from 'react-spring';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ChangeEvent, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import Asterisk from '../common/Asterisk';
import { Checkbox } from '../ui/checkbox';
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing.';
import { updateUser } from '@/lib/actions/users.actions';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { FeelingValidation } from '@/lib/validations/feeling';
import { createFeeling } from '@/lib/actions/feeling.actions';
import { useOrganization } from '@clerk/nextjs';

interface HeadingProps {
  user: {
    id: string;
    objectId: string;
    name: string;
    username: string;
    image: string;
    bio: string;
    gender: Gender;
  };
  btnTitle: string;
}

const PostFeeling = ({ userId }: { userId: string }) => {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing('media');
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const { organization } = useOrganization();

  // react-spring animation
  const springProps = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: config.default,
  });

  // form initial values and validation
  const form = useForm<z.infer<typeof FeelingValidation>>({
    resolver: zodResolver(FeelingValidation),
    defaultValues: {
      feeling: '',
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof FeelingValidation>) => {
    await createFeeling({
      text: values.feeling,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
    });

    router.push('/');
  };

  return (
    <Form {...form}>
      <animated.form
        className='mt-10 flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
        style={springProps}
      >
        <FormField
          control={form.control}
          name='feeling'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Content
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Textarea rows={15} {...field} className='!text-[18px]' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-primary-500'>
          Post Feeling
        </Button>
      </animated.form>
    </Form>
  );
};

export default PostFeeling;
