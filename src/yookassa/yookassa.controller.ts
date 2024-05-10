import { Body, Controller, Post, HttpCode } from '@nestjs/common'
import { YookassaNotificationDto } from './yookassa.interface'
import { YookassaService } from './yookassa.service'

@Controller()
export class YookassaController {
  constructor(private readonly yookassaService: YookassaService) {}

  @Post('webhook')
  @HttpCode(200)
  async webhook(@Body() body: YookassaNotificationDto) {
    this.yookassaService.notification(body)
  }
}
