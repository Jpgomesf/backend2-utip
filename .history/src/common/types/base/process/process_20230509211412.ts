import { z } from 'zod'

export enum ContactTypeEnum {
    Phone = 'phone',
    Email = 'email',
    Whatsapp = 'whatsapp',
}

export const SContactBase = z.object({
    preferred: z.boolean(),
})
export type IContactBase = z.infer<typeof SContactBase>
export const contactBaseModel = (): IContactBase => ({
    preferred: false,
})

export const SContactPhone = SContactBase.extend({
    type: z.literal(ContactTypeEnum.Phone),
    number: z
        .string()
        .min(8)
        .max(16)
        .regex(/^[1-9][0-9](9?)[1-9]([0-9]{7})$/, 'phone_must_be_valid'),
})

export type IContactPhone = z.infer<typeof SContactPhone>
export const contactPhoneModel = (): IContactPhone => ({
    ...contactBaseModel(),
    type: ContactTypeEnum.Phone,
    number: '',
})
export const SContactWhatsapp = SContactPhone.omit({ type: true }).extend({
    type: z.literal(ContactTypeEnum.Whatsapp),
})
export type IContactWhatsapp = z.infer<typeof SContactWhatsapp>
export const contactWhatsappModel = (): IContactWhatsapp => ({
    ...contactPhoneModel(),
    type: ContactTypeEnum.Whatsapp,
})