import { z } from 'zod'

export enum ProcessStepsTypeEnum {
    Delegacia = 'delegacia',
    MinisterioPublico = 'ministerio-publico',
    ApresentacaoDefesa = 'apresentacao-defesa',
    AudienciaInqueritoJudicial = 'aij',
    Sentenca = 'sentenca',
    Finalizado = 'finalizado',
}

export enum ProcessStatusTypeEnum  {
    Ok = 'ok',
    Warning = 'warning',
    Danger = 'danger',
    Hold = 'hold',
    Delivered = 'delivered' 
}

export const SProcess = z.object({
    steps: z.nativeEnum(ProcessStepsTypeEnum),
    status: z.nativeEnum(ProcessStatusTypeEnum).default(ProcessStatusTypeEnum.Ok),
    processNumber: z.string().max(30),
    attorneyName: z.string().optional().nullable(),
    defendantName: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    dateStepUpdate: z.date(),
})
export type IProcess = z.infer<typeof SProcess>