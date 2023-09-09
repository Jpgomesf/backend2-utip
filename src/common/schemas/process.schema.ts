import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import {
  ProcessStatusTypeEnum,
  ProcessStepsTypeEnum,
  ProcessAttorneyTypeEnum,
} from '../types'

@Schema({ timestamps: true })
export class Process extends Document {
  @Prop({ required: true, enum: ProcessStepsTypeEnum })
  steps: ProcessStepsTypeEnum

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

