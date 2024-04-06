import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, UsePipes } from '@nestjs/common'
import { UniqueConstraintViolationException } from '@mikro-orm/mysql'
import { ValidationPipe } from '../shared/pipes/validation.pipe'
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto'
import { User } from './user.decorator'
import { IUserData } from './user.interface'
import { UserService } from './user.service'

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('user')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  async findMe(@User('id') userId: number): Promise<IUserData> {
    return this.userService.findById(userId)
  }

  @UsePipes(new ValidationPipe())
  @Put('user')
  async update(@User('id') userId: number, @Body('user') userData: UpdateUserDto) {
    return this.userService.update(userId, userData)
  }

  @UsePipes(new ValidationPipe())
  @Post('users')
  async create(@Body('user') userData: CreateUserDto) {
    try {
      await this.userService.create(userData)
      return
    } catch (e) {
      if (e instanceof UniqueConstraintViolationException) return
      throw e
    }
  }

  @Delete('users/:slug')
  async delete(@Param() params): Promise<any> {
    return this.userService.delete(params.slug)
  }

  @UsePipes(new ValidationPipe())
  @Post('users/login')
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<IUserData> {
    const foundUser = await this.userService.findOne(loginUserDto)

    const errors = { User: ' not found' }
    if (!foundUser) {
      throw new HttpException({ errors }, 401)
    }

    return this.userService.buildUserRO(foundUser)
  }
}
