import z from 'zod'

export enum ProcessStepsTypeEnum {
  Delegacia = 'delegacia',
  MinisterioPublico = 'ministerio-publico',
  Citacao = 'citação',
  ApresentacaoDefesa = 'apresentacao-defesa',
  ImpugnacaoMP = 'impugnação-mp',
  AudienciaInqueritoJudicial = 'aij',
  MemoriaisDefesa = 'memoriais-defesa',
  MemoriaisMinisterioPublico = 'memoriais-ministerio-publico',
  Sentenca = 'sentenca',
  Finalizado = 'finalizado',
}

export enum ProcessAttorneyTypeEnum {
  Private = 'advogado-constituido',
  Public = 'defensoria-publica',
}

export enum ProcessStatusTypeEnum {
  Ok = 'ok',
  Warning = 'warning',
  Danger = 'danger',
  Hold = 'hold',
  Delivered = 'delivered',
}

export const SStepsHistory = z.object({
  step: z.nativeEnum(ProcessStepsTypeEnum),
  startDate: z.coerce.date().nullable().default(null),
  finalDate: z.coerce.date().nullable().default(null),
  phaseDaysCounter: z.number().optional(),
  lastStatus: z.nativeEnum(ProcessStatusTypeEnum).optional(),
})
export type IStepsHistory = z.infer<typeof SStepsHistory>

export const SProcess = z.object({
  stepsHistory: SStepsHistory.array(),
  status: z.nativeEnum(ProcessStatusTypeEnum).default(ProcessStatusTypeEnum.Ok),
  processNumber: z.string().max(30),
  attorneyType: z.nativeEnum(ProcessAttorneyTypeEnum),
  defendantName: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  dateStepUpdate: z.date(),
  incarcerationDate: z.date(),
  incarcerationDaysCount: z.number().optional(),
  daysSinceStepUpdate: z.number().int().default(0),
})
export type IProcess = z.infer<typeof SProcess>

export const SProcessAnalitycs = z.object({
  ok: z.number(),
  warning: z.number(),
  danger: z.number(),
  hold: z.number(),
  delivered: z.number(),
  total: z.number(),
})

export type IProcessAnalitycs = z.infer<typeof SProcessAnalitycs>
