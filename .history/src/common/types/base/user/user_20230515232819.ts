import { z } from 'zod'

export const SUser = z.object({
    name: z.string(),
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    password: z.string().regex(/^[1-9][0-9](9?)[1-9]([0-9]{7})$/, 'phone_must_be_valid'),
})

export type IUser = z.infer<typeof SUser>