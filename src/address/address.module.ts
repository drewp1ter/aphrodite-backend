import { Module } from '@nestjs/common'
import { AddressController } from './address.controller'
import { AddressService } from './address.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Address } from './address.entity'
import { User } from '../user/user.entity'
@Module({
  controllers: [AddressController],
  providers: [AddressService],
  imports: [MikroOrmModule.forFeature({ entities: [Address, User] })]
})
export class AddressModule {}
