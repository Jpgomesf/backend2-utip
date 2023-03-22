import { Controller, Post, Body, Get, NotFoundException, InternalServerErrorException, HttpStatus, HttpCode, NotAcceptableException, Param, Put, Delete } from '@nestjs/common';
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
      throw new NotAcceptableException("this user already exists");
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

  @Get(':userId')
  async getUserById(@Param('userId') userId: string): Promise<User> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Put(':userId')
  async updateUser(@Param('userId') userId: string, @Body() updateUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userService.getUserById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    } else {
      try {
        const updatedUser = await this.userService.updateUser(userId, updateUserDto);
        return updatedUser;
      } catch (error) {
        throw new InternalServerErrorException('Failed to update user');
      }
    }
  }

  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string): Promise<void> {
    const existingUser = await this.userService.getUserById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    } else {
      try {
        await this.userService.deleteUser(userId);
      } catch (error) {
        throw new InternalServerErrorException('Failed to delete user');
      }
    }
  }
}