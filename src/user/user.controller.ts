import { Body, Controller, Get, HttpException, Post, Put, UsePipes } from '@nestjs/common'
import { UniqueConstraintViolationException } from '@mikro-orm/mysql'
import { ValidationPipe } from '../shared/pipes/validation.pipe'
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto'
import { User } from './user.decorator'
import { IUserData } from './user.interface'
import { UserService } from './user.service'

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Roles } from './role/roles.decorator'

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Roles('user')
  async findMe(@User('id') userId: number): Promise<IUserData> {
    return this.userService.findById(userId)
  }

  @UsePipes(new ValidationPipe())
  @Put('profile')
  @Roles('user')
  async update(@User('id') userId: number, @Body('user') userData: UpdateUserDto) {
    return this.userService.update(userId, userData)
  }

  @UsePipes(new ValidationPipe())
  @Post('users')
  async create(@Body('user') userData: CreateUserDto) {
    try {
      await this.userService.signUp(userData)
      return
    } catch (e) {
      if (e instanceof UniqueConstraintViolationException) return
      throw e
    }
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<IUserData> {
    return this.userService.signIn(loginUserDto)
  }
}
