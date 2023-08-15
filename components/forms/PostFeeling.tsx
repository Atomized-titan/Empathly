'use client';

import { useOrganization } from '@clerk/nextjs';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { animated, config, useSpring } from 'react-spring';
import * as z from 'zod';

import { createFeeling } from '@/lib/actions/feeling.action';
import { useUploadThing } from '@/lib/uploadthing.';
import { isBase64Image } from '@/lib/utils';
import { FeelingValidation } from '@/lib/validations/feeling';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';

const PostFeeling = ({ userId }: { userId: string }) => {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing('media');
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const { organization } = useOrganization();

  const { toast } = useToast();

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
      image: '',
    },
  });

  const handleImageUpload = (
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

  const onSubmit = async (values: z.infer<typeof FeelingValidation>) => {
    setLoading(true);
    const blob = values.image;
    const hasImageChanged = isBase64Image(blob);

    if (hasImageChanged) {
      const imgRes = await startUpload(files);

      if (imgRes && imgRes[0].url) {
        values.image = imgRes[0].url;
      }
    }

    await createFeeling({
      text: values.feeling,
      image: values.image,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
    });
    toast({
      description: 'Feeling posted!',
    });
    setLoading(false);
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
                <Textarea rows={10} {...field} className='!text-[18px]' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-4'>
              <FormLabel className='text-lg font-semibold text-light-2'>
                Upload Image
              </FormLabel>
              <FormControl>
                <div className='relative border border-dark-4 bg-dark-3 text-light-1 rounded-md overflow-hidden'>
                  <label
                    htmlFor='image-upload'
                    className='cursor-pointer flex items-center justify-center p-4 text-sm font-medium hover:bg-dark-4'
                  >
                    <PhotoIcon className='w-6 h-6 text-light-1 mr-2' />
                    Upload Image
                  </label>
                  <input
                    type='file'
                    id='image-upload'
                    accept='image/*'
                    className='sr-only'
                    onChange={(e) => handleImageUpload(e, field.onChange)}
                  />
                  {field.value && (
                    <div className='mt-2'>
                      <Image
                        src={field.value}
                        alt='uploaded_image'
                        width={200}
                        height={150}
                        className='rounded-lg object-cover'
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='!bg-primary' disabled={loading}>
          {loading ? (
            <div className='flex items-center gap-2'>
              <ArrowPathIcon className='w-5 h-5 animate-spin' />
              <span>Please wait</span>
            </div>
          ) : (
            <span>Post Feeling</span>
          )}
        </Button>
      </animated.form>
    </Form>
  );
};

export default PostFeeling;
