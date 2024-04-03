import { Controller, Post, Body, UsePipes } from '@nestjs/common'
import { ValidationPipe } from '../shared/pipes/validation.pipe'
import { OrderService } from './order.service'
import { CreateOrderDto } from './dto/create-order.dto'

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto)
  }
}
