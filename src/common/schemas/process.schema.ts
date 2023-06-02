import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document } from 'mongoose'
import { ProcessStatusTypeEnum, ProcessStepsTypeEnum, ProcessAttorneyTypeEnum } from '../types'

@Schema({ timestamps: true })
export class Process extends Document {
  @Prop({ required: true, enum: ProcessStepsTypeEnum })
  steps: ProcessStepsTypeEnum

  @ApiProperty({ example: 'pending', description: 'The status of the process' })
  @Prop({ required: [true, 'Status is required'], enum: ProcessStatusTypeEnum })
  status: ProcessStatusTypeEnum
  
  @ApiProperty({ example: '123456789', description: 'The process number' })
  @Prop({ required: [true, 'Process number is required'], unique: true, trim: true })
  processNumber: string
  
  @ApiProperty({ example: 'Jane Smith', description: 'The attorney name' })
  @Prop({ enum: ProcessAttorneyTypeEnum, default: ProcessAttorneyTypeEnum.Public })
  attorneyType: ProcessAttorneyTypeEnum

  @ApiProperty({ example: 'John Doe', description: 'The defendant name' })
  @Prop({ trim: true })
  defendantName: string

  @Prop()
  dateStepUpdate: Date

  @Prop()
  daysSinceStepUpdate: number

  @Prop()
  description: string

}

export const ProcessSchema = SchemaFactory.createForClass(Process)