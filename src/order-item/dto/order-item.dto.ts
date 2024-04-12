import { IsNotEmpty, IsPositive } from 'class-validator'

export class OrderItemDto {
  @IsNotEmpty()
  @IsPositive()
  productId!: number

  @IsNotEmpty()
  @IsPositive()
  amount!: number
}