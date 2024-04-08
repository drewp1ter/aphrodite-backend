import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { UniqueConstraintViolationException } from '@mikro-orm/mysql'
import { ValidationPipe } from '../shared/pipes/validation.pipe'
import { SignInDto, SignUpDto } from './dto'
import { ISignInData } from './auth.interface'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('sign-up')
  async signUp(@Body('user') userData: SignUpDto) {
    try {
      await this.authService.signUp(userData)
      return
    } catch (e) {
      if (e instanceof UniqueConstraintViolationException) return
      throw e
    }
  }

  @UsePipes(new ValidationPipe())
  @Post('sign-in')
  async signIn(@Body('user') loginUserDto: SignInDto): Promise<ISignInData> {
    return this.authService.signIn(loginUserDto)
  }
}
