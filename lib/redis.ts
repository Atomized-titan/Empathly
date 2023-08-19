/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Redis } from '@upstash/redis';

export const db = new Redis({
  // @ts-ignore
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
