import { z } from 'zod'

export const SUser = z.object({
    name: z.string(),
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    password: z.string().min(6),
})

export type IUser = z.infer<typeof SUser>