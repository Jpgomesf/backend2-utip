import { z } from 'zod'
import { SProcess } from '../base'

export const DSProcess = SProcess.extend({
    daysSinceStepUpdate: z.number().int().default(0),
})
export type DIProcess = z.infer<typeof DSProcess>