import { z } from 'zod'
const DangerLevelStatsSchema = z.object({
  ok: z.number(),
  warning: z.number(),
  danger: z.number(),
  total: z.number(),
})