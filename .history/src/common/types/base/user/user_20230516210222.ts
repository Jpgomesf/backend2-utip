import { z } from 'zod'

export const SUser = z.object({
    name: z.string(),
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    password: z.string().minLength(6),
})

export type IUser = z.infer<typeof SUser>