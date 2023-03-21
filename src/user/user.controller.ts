import { Controller, Post, Body, Get, NotFoundException, InternalServerErrorException, HttpStatus, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;
    const existingUser = await this.userService.findUserByEmail(email);

    if (existingUser) {
      const updatedUser = await this.userService.updateUser(existingUser._id, createUserDto);
      return updatedUser;
    } else {
      try {
        const user = await this.userService.createUser(createUserDto);
        return user;
      } catch (error) {
        throw new InternalServerErrorException('Failed to create user');
      }
    }
  }

  @Get()
  async getUsers(): Promise<User[]> {
    try {
      const users = await this.userService.getUsers();
      if (users.length === 0) {
        throw new NotFoundException('No users found');
      }
      return users;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get users');
    }
  }
}