import { Body, Controller, Get, Param, Patch, Post, UsePipes, ParseIntPipe, Delete, BadRequestException } from '@nestjs/common'
import { UniqueConstraintViolationException } from '@mikro-orm/mysql'
import { ValidationPipe } from '../shared/pipes/validation.pipe'
import { ApiBearerAuth } from '@nestjs/swagger'
import { CreateDeliveryPriceDto } from './dto/create-delivery-price.dto'
import { InputDeliveryPriceDto } from './dto/input-delivery-price.dto'
import { DeliveryPriceService } from './delivery-price.service'
import { Roles } from '../role/roles.decorator'

@ApiBearerAuth()
@Controller('delivery-prices')
export class DeliveryPriceController {
  constructor(private readonly deliveryPriceService: DeliveryPriceService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  @Roles('admin')
  async create(@Body() dto: CreateDeliveryPriceDto) {
    try {
      await this.deliveryPriceService.create(dto.deliveryPrices)
    } catch (e) {
      if (e instanceof UniqueConstraintViolationException) {
        throw new BadRequestException('name должно быть уникальным')
      }
    }
  }

  @Get()
  async findAll() {
    return this.deliveryPriceService.findAll()
  }

  @Patch(':deliveryPriceId')
  @Roles('admin')
  @UsePipes(new ValidationPipe())
  async update(@Param('deliveryPriceId', ParseIntPipe) deliveryPriceId: number, @Body() dto: InputDeliveryPriceDto) {
    return this.deliveryPriceService.update(deliveryPriceId, dto)
  }

  @Delete(':deliveryPriceId')
  @Roles('admin')
  async delete(@Param('deliveryPriceId', ParseIntPipe) deliveryPriceId: number) {
    return this.deliveryPriceService.delete(deliveryPriceId)
  }
}
