import { IsNotEmpty, IsPhoneNumber, MaxLength, IsArray, IsOptional, IsEnum } from 'class-validator'
import { CreateAddressDto } from '../../address/dto/create-address.dto'
import { OrderItemDto } from './order-item.dto'
import { OrderPaymentType } from '../order.entity'

export class CreateOrderDto {
  @IsNotEmpty()
  @IsPhoneNumber()
  readonly phone!: string
  
  @IsNotEmpty()
  readonly name!: string

  @IsOptional()
  @MaxLength(8192)
  readonly comment!: string

  @IsNotEmpty()
  @IsEnum(OrderPaymentType)
  readonly paymentType!: OrderPaymentType

  @IsNotEmpty()
  readonly address!: CreateAddressDto

  @IsNotEmpty()
  @IsArray()
  readonly items!: OrderItemDto[]
}