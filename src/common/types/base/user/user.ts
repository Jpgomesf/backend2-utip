import { z } from 'zod'

export enum UserTypeEnum {
    Admin = 'admin',
    Assistant = 'assistant',
}

export const SUser = z.object({
    name: z.string(),
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    password: z.string().min(6),
    type: z.nativeEnum(UserTypeEnum).default(UserTypeEnum.Assistant),
})

export type IUser = z.infer<typeof SUser>