import { PrimaryKey, Entity, ManyToMany, Collection, Property, EntityDTO } from '@mikro-orm/core'
import { Product } from '../product/product.entity'

@Entity()
export class Tag {
  constructor(tag: string) {
    this.tag = tag
  }

  @PrimaryKey()
  id!: number

  @ManyToMany({ entity: () => Product, mappedBy: (product) => product.tags, hidden: true })
  products = new Collection<Product>(this)

  @Property({ unique: true })
  tag: string
}

export interface TagDto extends EntityDTO<Tag> {}