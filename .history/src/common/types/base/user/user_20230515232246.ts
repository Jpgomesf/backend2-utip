import { z } from 'zod'

export const SUser = z.object({
    name: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
})