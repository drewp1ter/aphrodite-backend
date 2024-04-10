import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { SignInDto, SignUpDto } from './dto'
import { ISignInData } from './auth.interface'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private jwtService: JwtService) {}

  async signIn(loginUserDto: SignInDto): Promise<ISignInData>  {
    const user = await this.userService.findOne(loginUserDto.email, loginUserDto.password)
    const token = await this.jwtService.signAsync({ id: user.id, roles: user.roles })
    return { ...user, token }
  }

  async signUp(createUserDto: SignUpDto) {
    return this.userService.create(createUserDto)
  }
}
