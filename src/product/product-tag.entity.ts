import { Entity, ManyToOne, PrimaryKeyProp, EntityDTO } from '@mikro-orm/core'
import { Product } from '../product/product.entity'
import { Tag } from './tag.entity'
@Entity()
export class ProductTag {
  [PrimaryKeyProp]?: ['order', 'product']

  constructor(partial: Partial<ProductTag>) {
    Object.assign(this, partial)
  }

  @ManyToOne({ primary: true })
  tag!: Tag

  @ManyToOne({ primary: true })
  product!: Product
}

export interface ProductTagDto extends EntityDTO<ProductTag> {}