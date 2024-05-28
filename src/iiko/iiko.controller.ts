import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { IikoService } from './iiko.service'
import { UpdateProductsBody } from './iiko.interface'
import { config } from '../config'

@ApiBearerAuth()
@Controller('iiko')
export class IikoController {
  constructor(private readonly iikoService: IikoService) {}

  @Post('update-products')
  async updateProducts(@Body() body: UpdateProductsBody) {
    if (body.token !== config.iiko.updateToken) return
    return this.iikoService.updateProducts()
  }
}
