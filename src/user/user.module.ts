import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { User } from './user.entity'
import { UserAddress } from './user-address.entity'
import { UserService } from './user.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { AuthModule } from '../auth/auth.module'

@Module({
  controllers: [UserController],
  exports: [UserService],
  imports: [MikroOrmModule.forFeature({ entities: [User, UserAddress] })],
  providers: [UserService]
})
export class UserModule {}
