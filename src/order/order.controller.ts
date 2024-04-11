import { Controller, Post, Body, UsePipes, BadRequestException, ParseIntPipe, Get, Param, Delete, Query, Patch } from '@nestjs/common'
import { ForeignKeyConstraintViolationException, CheckConstraintViolationException } from '@mikro-orm/mysql'
import { ValidationPipe } from '../shared/pipes/validation.pipe'
import { OrderService } from './order.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { Roles } from '../auth/role/roles.decorator'
import { User } from '../user/user.decorator'
import { OrderItemDto } from './dto/order-item.dto'

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
      if (e instanceof CheckConstraintViolationException) {
        throw new BadRequestException('Item amount is incorrect.')
      }
      throw new BadRequestException()
    }
  }

  @Get('my')
  @Roles('user')
  async findAllByUser(
    @User('id') customerId: number,
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize: number
  ) {
    return this.orderService.findAllByUser({ customerId, page, pageSize })
  }

  @Get(':orderId')
  @Roles('user')
  async findOne(@User('id') userId: number, @Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.findOne(orderId, userId)
  }

  @Get()
  @Roles('admin')
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize: number
  ) {
    return this.orderService.findAll(page, pageSize)
  }

  @UsePipes(new ValidationPipe())
  @Post(':orderId')
  @Roles('admin')
  async addProduct(@Body() orderItemDto: OrderItemDto, @Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.addProduct({ orderId, productId: orderItemDto.productId, amount: orderItemDto.amount })
  }

  @Delete(':orderId/:productId')
  @Roles('admin')
  async removeProduct(@Param('orderId', ParseIntPipe) orderId: number, @Param('productId', ParseIntPipe) productId: number) {
    return this.orderService.removeProduct({ orderId, productId })
  }

  @Delete(':orderId')
  @Roles('admin')
  async delete(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.delete(orderId)
  }

  @Patch(':orderId')
  @Roles('admin')
  async confirm(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.confirm(orderId)
  }
}
