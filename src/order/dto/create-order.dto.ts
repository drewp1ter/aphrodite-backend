import { IsNotEmpty, IsPhoneNumber, MaxLength, IsArray, IsOptional, IsEnum } from 'class-validator'
import { CreateAddressDto } from '../../address/dto/create-address.dto'
import { OrderItemDto } from '../../order-item/dto/order-item.dto'
import { OrderPaymentType } from '../order.interface'

export class CreateOrderDto {
  @IsPhoneNumber('RU', { message: 'Неверный формат телефонного номера' })
  readonly phone!: string
  
  @IsNotEmpty({ message: 'Имя должно быть не пустым' })
  readonly name!: string

  @IsOptional()
  @MaxLength(8192)
  readonly comment!: string

  @IsNotEmpty()
  @IsEnum(OrderPaymentType)
  readonly paymentType!: OrderPaymentType

  @IsNotEmpty({ message: 'Адрес должен быть не пустым' })
  readonly address!: CreateAddressDto

  @IsNotEmpty()
  @IsArray()
  readonly items!: OrderItemDto[]
}