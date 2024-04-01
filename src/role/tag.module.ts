import { Module } from '@nestjs/common'
import { Role } from './role.entity'
import { MikroOrmModule } from '@mikro-orm/nestjs'

@Module({
  controllers: [],
  exports: [],
  imports: [MikroOrmModule.forFeature({ entities: [Role] })],
  providers: []
})
export class RoleModule {}
