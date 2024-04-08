import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { UserService } from '../user/user.service'
import { RoleModule } from './role/role.module'
import { AuthService } from './auth.service'
import { UserRepository } from '../user/user.repository'

@Module({
  controllers: [AuthController],
  exports: [],
  imports: [RoleModule],
  providers: [UserService, AuthService, UserRepository]
})
export class AuthModule {}
