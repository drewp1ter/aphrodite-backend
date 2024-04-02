import { Module, MiddlewareConsumer, RequestMethod, NestModule } from '@nestjs/common'
import { AddressController } from './address.controller'
import { AddressService } from './address.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { AuthMiddleware } from '../user/auth.middleware'
import { Address } from './address.entity'
import { User } from '../user/user.entity'
import { UserModule } from '../user/user.module'

@Module({
  controllers: [AddressController],
  providers: [AddressService],
  imports: [MikroOrmModule.forFeature({ entities: [Address, User] }), UserModule]
})
export class AddressModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'addresses', method: RequestMethod.GET },
        { path: 'addresses', method: RequestMethod.POST },
        { path: 'addresses/:id', method: RequestMethod.DELETE }
      )
  }
}
