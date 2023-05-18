import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { UserTypeEnum } from '../types'

@Schema({
    timestamps: true,
})
export class User extends Document {
  @Prop({
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+([a-zA-Z0-9._%+-]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
    trim: true,
    lowercase: true,
  })
  email: string

  @Prop({
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  })
  name: string

  @Prop({
    type: String,
    required: [true, 'Password is Required']
  })
  password: string

  @Prop({enum: UserTypeEnum})
  type: UserTypeEnum
}

export const UserSchema = SchemaFactory.createForClass(User)