import { IsNotEmpty, IsPhoneNumber, MaxLength, IsArray, IsOptional, IsEnum, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { CreateAddressDto } from '../../address/dto/create-address.dto'
import { OrderItemDto } from '../../order-item/dto/order-item.dto'
import { OrderPaymentType } from '../order.interface'

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Телефон должен быть не пустым' })
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

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  readonly address!: CreateAddressDto

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  readonly items!: OrderItemDto[]
}