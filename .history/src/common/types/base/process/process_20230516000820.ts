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
    processNumber: z.string(),
    status: z.nativeEnum(ProcessStatusTypeEnum),
    dateStatusUpdate: z.date(),
})