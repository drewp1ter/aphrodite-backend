import { IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { InputDeliveryPriceDto } from './input-delivery-price.dto'

export class CreateDeliveryPriceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InputDeliveryPriceDto)
  readonly deliveryPrices!: InputDeliveryPriceDto[]
}