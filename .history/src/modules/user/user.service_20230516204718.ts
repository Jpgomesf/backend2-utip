import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from '../../common/schemas/user.schema'
import { IUser } from '../../common/types/base'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec()
  }

  async findUserById(_id: string): Promise<User | null> {
    return this.userModel.findById(_id).exec()
  }

  async createUser(createUserDto: IUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    })
    return await user.save()
  }

  async getUsers(): Promise<User[]> {
    return this.userModel.find().exec()
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec()
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  async updateUser(userId: string, updateUserDto: IUser): Promise<User> {
    const updatedUser = await this.userModel
    .findByIdAndUpdate(
      userId,
      {
        $set: updateUserDto,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .exec()

    if (!updatedUser) {
      throw new NotFoundException('User not found')
    }

    return updatedUser
  }

  async deleteUser(userId: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: userId }).exec()
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }
  }
}