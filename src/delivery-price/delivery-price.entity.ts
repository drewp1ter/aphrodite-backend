import { Entity, Property, Check, EntityDTO, wrap, types } from '@mikro-orm/core'
import { BaseEntity } from '../shared/entities/base.entity'

@Entity()
export class DeliveryPrice extends BaseEntity {
  constructor(partial: Partial<DeliveryPrice>) { 
    super()
    Object.assign(this, partial)
  }

  @Property({ default: '' })
  value?: string

  @Property({ unique: true })
  name!: string

  @Property({ type: types.float })
  @Check({ expression: 'price >= 0' })
  price!: number


  toJSON() {
    const deliveryPrice = wrap<DeliveryPrice>(this).toObject() as DeliveryPriceDto
    return deliveryPrice
  }
}

export interface DeliveryPriceDto extends EntityDTO<DeliveryPrice> {}
