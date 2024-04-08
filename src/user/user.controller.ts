import { Body, Controller, Get, Put, UsePipes } from '@nestjs/common'
import { ValidationPipe } from '../shared/pipes/validation.pipe'
import { UpdateUserDto } from './dto'
import { User } from './user.decorator'
import { IUserData } from './user.interface'
import { UserService } from './user.service'

import { ApiBearerAuth } from '@nestjs/swagger'
import { Roles } from '../auth/role/roles.decorator'

@ApiBearerAuth()
@Roles('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findMe(@User('id') userId: number): Promise<IUserData> {
    return this.userService.findById(userId)
  }

  @UsePipes(new ValidationPipe())
  @Put()
  async update(@User('id') userId: number, @Body('user') userData: UpdateUserDto) {
    return this.userService.update(userId, userData)
  }
}
