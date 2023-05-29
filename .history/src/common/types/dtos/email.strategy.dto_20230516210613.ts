import { z } from 'zod'

export const DSEmailStrategy = z.object({
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    password: z.string().min(6),
})

export type DIEmailStrategy = z.infer<typeof DSEmailStrategy>