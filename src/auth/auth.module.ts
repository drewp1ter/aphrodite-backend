import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { UserModule } from '../user/user.module'
import { RoleModule } from '../role/role.module'
import { AuthService } from './auth.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { User } from '../user/user.entity'

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  imports: [MikroOrmModule.forFeature({ entities: [User] }), RoleModule, UserModule],
  providers: [AuthService]
})
export class AuthModule {}
