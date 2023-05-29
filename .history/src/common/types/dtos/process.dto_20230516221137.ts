import { z } from 'zod'
import { SProcess } from '../base'

export const DSProcessResult = SProcess
export type DIProcess = z.infer<typeof DSProcessResult>