import { z } from 'zod'
import { SProcess } from '../base'

export const DSProcessResult = SProcess.extend({
    daysSinceCreated: z.number().int().default(0),
    daysSinceUpdated: z.number().int().default(0),
})
export type DIProcess = z.infer<typeof DSProcessResult>