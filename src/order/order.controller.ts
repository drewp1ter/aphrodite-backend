import {
  Controller,
  Post,
  Body,
  UsePipes,
  BadRequestException,
  InternalServerErrorException,
  ParseIntPipe,
  Get,
  Param,
  Delete,
  Query,
  Patch
} from '@nestjs/common'
import { ForeignKeyConstraintViolationException, CheckConstraintViolationException } from '@mikro-orm/mysql'
import { ValidationPipe } from '../shared/pipes/validation.pipe'
import { OrderService } from './order.service'
import { YookassaService } from '../yookassa/yookassa.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { Roles } from '../role/roles.decorator'
import { User } from '../user/user.decorator'
import { config } from '../config'
import { OrderItemDto } from '../order-item/dto/order-item.dto'

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService, private readonly yookassaService: YookassaService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await this.orderService.create(createOrderDto)

      if (createOrderDto.paymentType === 'online') {
        const description = `Заказ №${order.id}\n${order.items
          .map((item) => `${item.product.category.name}: ${item.product.name} * ${item.amount}\n`)
          .join('')}`

        const payment = await this.yookassaService.createPayment({
          amount: parseFloat(order.total),
          idempotenceKey: order.id.toString(),
          description,
          metadata: { orderId: order.id }
        })

        if (payment.status === 'pending') {
          return { redirectUrl: payment.confirmation.confirmation_url }
        }

        throw new InternalServerErrorException('The payment system returns bad status.')
      }

      return { redirectUrl: config.thankYouPage }
    } catch (e) {
      if (e instanceof ForeignKeyConstraintViolationException) {
        throw new BadRequestException('Product not found.')
      }
      if (e instanceof CheckConstraintViolationException) {
        throw new BadRequestException('Item amount is incorrect.')
      }
      throw e
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

  @Patch('confirm/:orderId')
  @Roles('admin')
  async confirm(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.confirm(orderId)
  }
}
