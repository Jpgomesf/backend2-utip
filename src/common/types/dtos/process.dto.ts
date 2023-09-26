import { z } from 'zod'
import { SProcess } from '../base'

export const DSProcess = SProcess.omit({
  status: true,
  dateStepUpdate: true,
  daysSinceStepUpdate: true,
  incarcerationDaysCount: true,
  incarcerationDate: true,
})
export type DIProcess = z.infer<typeof DSProcess>
