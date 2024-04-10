import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { RolesGuard } from './role.guard'
import { config } from '../../config'

const { NODE_ENV } = process.env
if (NODE_ENV === 'production' && config.jwt.secret === 'changeme') throw new Error('Please change jwt_secret !!!')
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: config.jwt.secret,
      signOptions: { expiresIn: config.jwt.expiresIn }
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
export class RoleModule {}
