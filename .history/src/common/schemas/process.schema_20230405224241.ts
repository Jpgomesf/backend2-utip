import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document } from 'mongoose'

@Schema({ timestamps: true })
export class Process extends Document {
  @ApiProperty({ example: '123456789', description: 'The process number' })
  @Prop({ required: [true, 'Process number is required'], unique: true, trim: true })
  processNumber: string

  @ApiProperty({ example: 'John Doe', description: 'The defendant name' })
  @Prop({ trim: true })
  defendantName: string

  @ApiProperty({ example: 'Jane Smith', description: 'The attorney name' })
  @Prop({ trim: true })
  attorneyName: string

  @ApiProperty({ example: 'pending', description: 'The status of the process' })
  @Prop({ required: [true, 'Status is required'], trim: true })
  status: string

  @Prop()
  dateStatusUpdated: Date

  @ApiProperty({
    example: '555-1234',
    description: 'The phone number of the defendant or attorney',
  })
  @Prop({ trim: true })
  phoneNumber: string
}

export const ProcessSchema = SchemaFactory.createForClass(Process)