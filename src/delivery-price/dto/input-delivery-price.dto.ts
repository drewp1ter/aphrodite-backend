import { IsNotEmpty, IsPositive } from 'class-validator'

export class InputDeliveryPriceDto {
  readonly value!: string
  
  @IsNotEmpty({ message: 'Имя должно быть не пустым' })
  readonly name!: string

  @IsPositive({ message: 'price не может быть меньшн или равно 0' })
  readonly price!: number
}