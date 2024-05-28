import {
  Controller,
  Post,
  Body,
  UsePipes,
  BadRequestException,
  ServiceUnavailableException,
  ParseIntPipe,
  Get,
  Param,
  Delete,
  Query,
  Patch,
} from '@nestjs/common'
import { ForeignKeyConstraintViolationException, CheckConstraintViolationException } from '@mikro-orm/mysql'
import { NotFoundError } from '@mikro-orm/core'
import { ValidationPipe } from '../shared/pipes/validation.pipe'
import { WorkingTimeValidationPipe } from '../shared/pipes/working-time.pipe'
import { OrderService } from './order.service'
import { YookassaService } from '../yookassa/yookassa.service'
import { DeliveryPriceService } from '../delivery-price/delivery-price.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { Roles } from '../role/roles.decorator'
import { User } from '../user/user.decorator'
import { config } from '../config'
import { OrderItemDto } from '../order-item/dto/order-item.dto'
import { WorkingDaysError, WorkingTimeError } from '../shared/interfaces/working-time-error.interface'

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService, 
    private readonly yookassaService: YookassaService,
    private readonly deliveryPriceService: DeliveryPriceService
  ) {}

  @UsePipes(new ValidationPipe())
  @UsePipes(new WorkingTimeValidationPipe())
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      let deliveryPrice = 0
      if (createOrderDto.address) {
        const existDeliveryPrice = await this.deliveryPriceService.findOneByName(createOrderDto.address.city)
        deliveryPrice = existDeliveryPrice.price
      }
      
      const order = await this.orderService.create(createOrderDto)

      if (createOrderDto.paymentType === 'online') {
        try {
          const payment = await this.yookassaService.createPayment({
            amount: parseFloat(order.total) + deliveryPrice,
            idempotenceKey: order.id.toString(),
            description: `Заказ №${order.id}, ${createOrderDto.phone}`,
            metadata: { orderId: order.id }
          })
  
          if (payment.status === 'pending') {
            return { redirectUrl: payment.confirmation.confirmation_url }
          }
        } catch {
          throw new ServiceUnavailableException('Ошибка платежной системы.')
        }
      }

      return { redirectUrl: config.thankYouPagePaymentCash }
    } catch (e) {
      if (e instanceof ForeignKeyConstraintViolationException) {
        throw new BadRequestException('Продукт не найден.')
      }

      if (e instanceof CheckConstraintViolationException) {
        throw new BadRequestException('Неверное количество продуктов.')
      }

      if (e instanceof NotFoundError) {
        throw new BadRequestException('Указано не существующее имя населенного пункта.')
      }

      if (e instanceof WorkingTimeError) {
        throw new ServiceUnavailableException(`Время заказа "${e.message}" ограничено с ${e.startTime} до ${e.endTime}.`)
      }

      if (e instanceof WorkingDaysError) {
        throw new ServiceUnavailableException(`Возможность заказа "${e.message}" доступна только в следующие дни недели: ${e.days}`)
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
