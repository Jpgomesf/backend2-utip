import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true,
})
export class Process extends Document {
    @Prop({
        type: String,
        required: [true, 'Process number is required'],
        unique: true,
        trim: true,
      })
  processNumber: number;

  @Prop({
    type: String,
    trim: true,
  })
  defendantName: string;

  @Prop({
    type: String,
    trim: true,
  })
  attorneyName: string;

  @Prop({
    type: String,
    required: [true, 'Status is required'],
    trim: true,
  })
  status: string;

  @Prop({
    type: String,
    trim: true,
  })
  phoneNumber: string;

}

export const ProcessSchema = SchemaFactory.createForClass(Process);