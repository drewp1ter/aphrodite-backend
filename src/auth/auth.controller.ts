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
  async signUp(@Body() signUpDto: SignUpDto) {
    try {
      await this.authService.signUp(signUpDto)
      return
    } catch (e) {
      if (e instanceof UniqueConstraintViolationException) return
      throw e
    }
  }

  @UsePipes(new ValidationPipe())
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto): Promise<ISignInData> {
    return this.authService.signIn(signInDto)
  }
}
