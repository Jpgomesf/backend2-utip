import { z } from 'zod'
import { SProcess } from '../base'

const DSProcess = SProcess.merge(
  z.object({
    daysSinceStepUpdate: z.number().int().default(0),
  })
);
export type DIProcess = z.infer<typeof DSProcess>