import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common'
import { MikroORM } from '@mikro-orm/core'
import { MikroOrmMiddleware, MikroOrmModule } from '@mikro-orm/nestjs'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { AppController } from './app.controller'
import { UserModule } from './user/user.module'
import { AddressModule } from './address/address.module'
import { CategoryModule } from './category/category.module'
import { OrderModule } from './order/order.module'
import { AuthModule } from './auth/auth.module'
import { IikoModule } from './iiko/iiko.module'
import { TelegramModule } from './telegram/telegram.module'
import { YookassaModule } from './yookassa/yookassa.module'
import { User } from './user/user.entity'
import { config } from './config'
import { AdminSeeder } from './seeder/admin.seeder'

@Module({
  controllers: [AppController],
  imports: [
    MikroOrmModule.forRoot(),
    EventEmitterModule.forRoot(),
    UserModule,
    AuthModule,
    AddressModule,
    CategoryModule,
    OrderModule,
    IikoModule,
    TelegramModule,
    YookassaModule
  ],
  providers: []
})

export class AppModule implements NestModule, OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      await this.orm.getMigrator().up()
    }

    if (process.env.NODE_ENV !== 'test') {
      const isAdminExists = await this.orm.em.count(User, { phone: config.admin.phone, email: config.admin.email })
      if (!isAdminExists) {
        await this.orm.seeder.seed(AdminSeeder)
      }
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroOrmMiddleware).forRoutes('*')
  }
}
