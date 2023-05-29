import { z } from 'zod'

export enum ProcessStatusTypeEnum {
    InqueritoPolicial = 'inquérito-policial',
    MinisterioPublico = 'ministério-público',
    ApresentacaoDefesa = 'apresentação-defesa',
    AudienciaInqueritoJudicial = 'aij',
    Sentenca = 'sentença',
    Finalizado = 'finalizado',
}


export const SProcess = z.object({
    status: z.nativeEnum(ProcessStatusTypeEnum),
    processNumber: z.string().max(30),
    attorneyName: z.string().optional().nullable(),
    defendantName: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    daysSinceUpdate: z.number().int().default(0),
    dateStatusUpdate: z.date(),
})
export type IProcess = z.infer<typeof SProcess>