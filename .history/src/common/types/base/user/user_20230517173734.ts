import { z } from 'zod'

export enum UserTypeEnum {
    Admin = 'admin',
    Auxiliar = 'auxiliar',
}

export const SUser = z.object({
    name: z.string(),
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    password: z.string().min(6),
    type: z.nativeEnum(UserTypeEnum),
})

export type IUser = z.infer<typeof SUser>