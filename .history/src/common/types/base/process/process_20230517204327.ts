import { z } from 'zod'

export enum ProcessStepsTypeEnum {
    InqueritoPolicial = 'inquérito-policial',
    MinisterioPublico = 'ministério-público',
    ApresentacaoDefesa = 'apresentação-defesa',
    AudienciaInqueritoJudicial = 'aij',
    Sentenca = 'sentença',
    Finalizado = 'finalizado',
}

export enum ProcessStatusTypeEnum  {
    Ok = 'ok',
    Warning = 'warning',
    Danger = 'danger',
    Hold = 'hold',
    Delivered = 'delivered' 
}

export class ProcessStatusAnalytics {
    ok: number = 0
    warning: number = 0
    danger: number = 0
    total: number = 0
}

export const SProcess = z.object({
    steps: z.nativeEnum(ProcessStepsTypeEnum),
    status: z.nativeEnum(ProcessStatusTypeEnum),
    processNumber: z.string().max(30),
    attorneyName: z.string().optional().nullable(),
    defendantName: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    daysSinceStepUpdate: z.number().int().default(0),
    dateStepUpdate: z.date(),
})
export type IProcess = z.infer<typeof SProcess>