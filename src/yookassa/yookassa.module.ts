import { Module } from '@nestjs/common'
import { YookassaController } from './yookassa.controller'
import { YookassaService } from './yookassa.service'

@Module({
  controllers: [YookassaController],
  providers: [YookassaService],
  imports: []
})
export class YookassaModule {}
