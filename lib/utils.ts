import { type ClassValue, clsx } from 'clsx';
import { ChangeEvent, SetStateAction } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  return `${time} - ${formattedDate}`;
}

export function toPusherKey(key: string) {
  return key.replace(/:/g, '__');
}

export function chatHrefConstructor(id1: string, id2: string) {
  const sortedIds = [id1, id2].sort();
  return `${sortedIds[0]}--${sortedIds[1]}`;
}

export function formatDateStringForMobile(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  const timeDifferenceInSeconds = Math.floor(
    (now.getTime() - date.getTime()) / 1000
  );

  if (timeDifferenceInSeconds < 60) {
    return `${timeDifferenceInSeconds} seconds ago`;
  } else if (timeDifferenceInSeconds < 3600) {
    const minutes = Math.floor(timeDifferenceInSeconds / 60);
    return `${minutes} minutes ago`;
  } else if (timeDifferenceInSeconds < 86400) {
    const hours = Math.floor(timeDifferenceInSeconds / 3600);
    return `${hours} hours ago`;
  } else {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    };

    return date.toLocaleDateString(undefined, options);
  }
}

export const handleImage = (
  e: ChangeEvent<HTMLInputElement>,
  fieldChange: (value: string) => void,
  toast: any,
  setFiles: (value: SetStateAction<File[]>) => void
) => {
  e.preventDefault();

  const fileReader = new FileReader();

  const handleFileLoad = async (event: ProgressEvent<FileReader>) => {
    const imageDataUrl = event.target?.result?.toString() || '';
    fieldChange(imageDataUrl);
  };

  if (e.target.files && e.target.files.length > 0) {
    const file = e.target.files[0];

    // Check if the file size exceeds 2 MB (2 * 1024 * 1024 bytes)
    if (file.size > 2 * 1024 * 1024) {
      console.log('File size exceeds the limit of 2 MB');
      toast({
        variant: 'destructive',
        title: 'Uh oh! Size limit exceeded.',
        description: 'The file size exceeds the limit of 2 MB.',
      });
      e.target.value = ''; // Reset the input element
      return;
    }

    setFiles(Array.from(e.target.files));

    if (!file.type.includes('image')) return;

    fileReader.onload = handleFileLoad;

    fileReader.readAsDataURL(file);

    e.target.value = ''; // Reset the input element
  }
};

export function formatUnixTimestamp(unixTimestamp: number): string {
  const date = new Date(unixTimestamp);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  };
  return date.toLocaleString(undefined, options);
}

export function formatUnixTimestampForBubble(unixTimestamp: number): string {
  const date = new Date(unixTimestamp);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleString(undefined, options);
}
