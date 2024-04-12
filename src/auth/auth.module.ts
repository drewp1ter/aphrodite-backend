import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { UserService } from '../user/user.service'
import { RoleModule } from '../role/role.module'
import { AuthService } from './auth.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { User } from '../user/user.entity'

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  imports: [MikroOrmModule.forFeature({ entities: [User] }), RoleModule],
  providers: [UserService, AuthService]
})
export class AuthModule {}
