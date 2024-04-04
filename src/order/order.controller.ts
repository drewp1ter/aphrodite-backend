import { Controller, Post, Body, UsePipes, BadRequestException } from '@nestjs/common'
import { ForeignKeyConstraintViolationException } from '@mikro-orm/mysql'
import { ValidationPipe } from '../shared/pipes/validation.pipe'
import { OrderService } from './order.service'
import { CreateOrderDto } from './dto/create-order.dto'

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const res = await this.orderService.create(createOrderDto)
      return res
    } catch (e) {
      if (e instanceof ForeignKeyConstraintViolationException) {
        throw new BadRequestException('Product not found.')
      }
      throw e
    }
  }
}
