import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import {
  ProcessStatusTypeEnum,
  ProcessStepsTypeEnum,
  ProcessAttorneyTypeEnum,
  IProcess,
  IStepsHistory,
} from '../types'

@Schema({ _id: false })
export class StepsHistory implements IStepsHistory {
  @Prop({ type: String, enum: ProcessStepsTypeEnum })
  step: IStepsHistory['step']

  @Prop({ type: Date })
  startDate: IStepsHistory['startDate']

  @Prop({ type: Date })
  finalDate: IStepsHistory['finalDate']
}
export const StepsHistorySchema = SchemaFactory.createForClass(StepsHistory)

@Schema({ timestamps: true })
export class Process extends Document implements IProcess {
  @Prop({ type: [StepsHistorySchema] })
  stepsHistory: IProcess['stepsHistory']

  @Prop({ enum: ProcessStatusTypeEnum })
  status: ProcessStatusTypeEnum

  @Prop({
    required: [true, 'Process number is required'],
    unique: true,
    trim: true,
  })
  processNumber: string

  @Prop({
    enum: ProcessAttorneyTypeEnum,
    default: ProcessAttorneyTypeEnum.Public,
  })
  attorneyType: ProcessAttorneyTypeEnum

  @Prop({ trim: true })
  defendantName: string

  @Prop()
  dateStepUpdate: Date

  @Prop()
  incarcerationDate: Date

  @Prop()
  daysSinceStepUpdate: number

  @Prop()
  description: string
}

export const ProcessSchema = SchemaFactory.createForClass(Process)
