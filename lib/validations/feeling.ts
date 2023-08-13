import * as z from 'zod';

export const FeelingValidation = z.object({
  feeling: z.string().nonempty().min(3, { message: 'Minimum 3 characters.' }),
  accountId: z.string(),
  image: z.string(),
});

export const CommentValidation = z.object({
  feeling: z.string().nonempty().min(3, { message: 'Minimum 3 characters.' }),
});
