import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common'
import { MikroORM } from '@mikro-orm/core'
import { MikroOrmMiddleware, MikroOrmModule } from '@mikro-orm/nestjs'

import { AppController } from './app.controller'
import { UserModule } from './user/user.module'
import { AddressModule } from './address/address.module'

@Module({
  controllers: [AppController],
  imports: [MikroOrmModule.forRoot(), UserModule, AddressModule],
  providers: []
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up()
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroOrmMiddleware).forRoutes('*')
  }
}
