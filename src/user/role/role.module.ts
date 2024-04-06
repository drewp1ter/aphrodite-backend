import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { RolesGuard } from './role.guard'
import { SECRET } from '../../config'

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: SECRET,
      signOptions: { expiresIn: '60s' }
    })
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
  controllers: [],
  exports: []
})

export class RoeleModule {}
