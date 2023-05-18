import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document } from 'mongoose'
import { ProcessStatusTypeEnum, ProcessStepsTypeEnum } from '../types'

@Schema({ timestamps: true })
export class Process extends Document {
  @ApiProperty({ example: '123456789', description: 'The process number' })
  @Prop({ required: [true, 'Process number is required'], trim: true })
  processNumber: string

  @ApiProperty({ example: 'John Doe', description: 'The defendant name' })
  @Prop({ trim: true })
  defendantName: string

  @ApiProperty({ example: 'Jane Smith', description: 'The attorney name' })
  @Prop({ trim: true })
  attorneyName: string

  @ApiProperty({ example: 'pending', description: 'The status of the process' })
  @Prop({ required: [true, 'Status is required'], enum: ProcessStatusTypeEnum })
  status: ProcessStatusTypeEnum

  @Prop({ required: true, enum: ProcessStepsTypeEnum })
  steps: ProcessStepsTypeEnum

  @Prop()
  dateStepUpdate: Date

  @Prop()
  daysSinceStepUpdate: number
}

export const ProcessSchema = SchemaFactory.createForClass(Process)