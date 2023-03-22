import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Process extends Document {
  @ApiProperty({ example: '123456789', description: 'The process number' })
  @Prop({
    type: String,
    required: [true, 'Process number is required'],
    unique: true,
    trim: true,
  })
  processNumber: number;

  @ApiProperty({ example: 'John Doe', description: 'The defendant name' })
  @Prop({
    type: String,
    trim: true,
  })
  defendantName: string;

  @ApiProperty({ example: 'Jane Smith', description: 'The attorney name' })
  @Prop({
    type: String,
    trim: true,
  })
  attorneyName: string;

  @ApiProperty({ example: 'pending', description: 'The status of the process' })
  @Prop({
    type: String,
    required: [true, 'Status is required'],
    trim: true,
  })
  status: string;

  @ApiProperty({
    example: '555-1234',
    description: 'The phone number of the defendant or attorney',
  })
  @Prop({
    type: String,
    trim: true,
  })
  phoneNumber: string;
}

export const ProcessSchema = SchemaFactory.createForClass(Process);