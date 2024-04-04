import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { AuthMiddleware } from './auth.middleware'
import { UserController } from './user.controller'
import { User } from './user.entity'
import { UserAddress } from './user-address.entity'
import { UserService } from './user.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'

@Module({
  controllers: [UserController],
  exports: [UserService],
  imports: [MikroOrmModule.forFeature({ entities: [User, UserAddress] })],
  providers: [UserService]
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({ path: 'user', method: RequestMethod.GET }, { path: 'user', method: RequestMethod.PUT })
  }
}
