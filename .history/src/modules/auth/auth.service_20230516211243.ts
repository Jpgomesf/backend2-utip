import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { DIEmailStrategy } from 'src/common'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: DIEmailStrategy): Promise<{ token: string }> {
    const { email, password } = loginDto

    const user = await this.userService.findUserByEmail(email)

    if (!user) {
      throw new UnauthorizedException('Invalid email or password')
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password)

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password')
    }

    const token = this.jwtService.sign({ id: user._id })

    return { token }
  }
}