import { z } from 'zod'
import { SProcess } from '../base'

export const DSProcessResult = SProcess.extend({
    daysSinceStepUpdate: z.number().int().default(0),
})
export type DIProcessResult = z.infer<typeof DSProcessResult>