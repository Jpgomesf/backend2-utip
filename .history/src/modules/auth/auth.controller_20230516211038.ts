import { Body, Controller, Get, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { DIEmailStrategy } from 'src/common'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: DIEmailStrategy): Promise<{ token: string }> {
    return await this.authService.login(loginDto)
  }
}