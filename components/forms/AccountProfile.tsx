'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UserValidation } from '@/lib/validations/user';
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

interface HeadingProps {
  user: {
    id: string;
    objectId: string;
    name: string;
    username: string;
    image: string;
    bio: string;
    gender: 'male' | 'female' | 'other';
  };
  btnTitle: string;
}
const AccountProfile = ({ user, btnTitle }: HeadingProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing('media');

  // react-spring animation
  const springProps = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: config.default,
  });

  // form initial values and validation
  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image || '',
      name: user?.name || '',
      username: user?.username || '',
      bio: user?.bio || '',
      gender: user?.gender || '',
    },
  });

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    const handleFileLoad = async (event: ProgressEvent<FileReader>) => {
      const imageDataUrl = event.target?.result?.toString() || '';
      fieldChange(imageDataUrl);
    };

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes('image')) return;

      fileReader.onload = handleFileLoad;

      fileReader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    const blob = values.profile_photo;
    const hasImageChanged = isBase64Image(blob);

    if (hasImageChanged) {
      const imgRes = await startUpload(files);

      if (imgRes && imgRes[0].url) {
        values.profile_photo = imgRes[0].url;
      }
    }

    //TODO: Backend function to update user
  };

  return (
    <Form {...form}>
      <animated.form
        className='flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
        style={springProps}
      >
        <FormField
          control={form.control}
          name='profile_photo'
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              <FormLabel className='account-form_image-label'>
                {field.value ? (
                  <Image
                    src={field.value}
                    alt='profile_icon'
                    width={96}
                    height={96}
                    priority
                    className='rounded-full object-contain'
                  />
                ) : (
                  <div className='text-heading2-bold text-light-2 capitalize  w-12 h-12 rounded-full flex items-center justify-center'>
                    {form.getValues('name') ? (
                      form.getValues('name').charAt(0).toUpperCase()
                    ) : (
                      <PhotoIcon className='w-12 h-12 text-light-2 cursor-pointer' />
                    )}
                  </div>
                )}
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                <Input
                  type='file'
                  accept='image/*'
                  placeholder='Add profile photo'
                  className='account-form_image-input'
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                <span>Name </span>
                <Asterisk />
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription className='!text-[14px] font-medium text-dark-5'>
                Use your name or a pseudonym—whichever lets you express yourself
                comfortably. Your privacy matters, especially when sharing
                personal thoughts.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                <span>Username </span>
                <Asterisk />
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription className='!text-[14px] font-medium text-dark-5'>
                Pick a display name that will be your unique username for
                logging in. Use your real name or a pseudonym—it's up to you.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='gender'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Gender (optional)
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className='w-[180px] account-form_input no-focus'>
                    <SelectValue placeholder='Select gender' />
                  </SelectTrigger>
                  <SelectContent className='account-form_input'>
                    <SelectGroup>
                      <SelectLabel>Gender</SelectLabel>
                      <SelectItem value='male'>Male</SelectItem>
                      <SelectItem value='female'>Female</SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription className='!text-[14px] font-medium text-dark-5'>
                Choose your gender. It's optional and helps us improve your
                experience on the platform. Your selection is private.
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription className='!text-[14px] font-medium text-dark-5'>
                Create a snapshot of yourself for your profile. Share hobbies,
                thoughts, or whatever feels right. Let others know you
                better—your bio adds a personal touch.
              </FormDescription>
            </FormItem>
          )}
        />

        <div className='items-top flex space-x-2'>
          <Checkbox id='terms' />
          <div className='grid gap-1.5 leading-none'>
            <label
              htmlFor='terms1'
              className='text-sm text-light-1 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Accept terms and conditions
            </label>
            <p className='text-sm text-dark-5 !text-[14px]'>
              You agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>

        <Button type='submit' className='bg-primary'>
          {btnTitle}
        </Button>
      </animated.form>
    </Form>
  );
};

export default AccountProfile;
