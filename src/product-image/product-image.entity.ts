import { Entity, Property, ManyToOne, EntityDTO, wrap } from '@mikro-orm/core'
import { BaseEntity } from '../shared/entities/base.entity'
import { Product } from '../product/product.entity'

@Entity()
export class ProductImage extends BaseEntity {
  @ManyToOne({ hidden: true })
  product!: Product

  @Property({ type: 'text' })
  url!: string

  @Property({ default: '' })
  type!: string

  constructor(partial: Partial<ProductImage>) {
    super()
    Object.assign(this, partial)
  }

  toJSON() {
    return wrap<ProductImage>(this).toObject() as ProductImageDto
  }
}

export interface ProductImageDto extends EntityDTO<ProductImage> {}
