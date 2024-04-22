import { Controller, Post } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { Roles } from '../role/roles.decorator'
import { IikoService } from './iiko.service'

@ApiBearerAuth()
@Controller('iiko')
export class IikoController {
  constructor(private readonly iikoService: IikoService) {}

  @Post('update-products')
  @Roles('admin')
  async updateProducts() {
    return this.iikoService.updateProducts()
  }
}
