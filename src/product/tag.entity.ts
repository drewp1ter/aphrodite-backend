import { PrimaryKey, Entity, ManyToMany, Collection, Property, EntityDTO } from '@mikro-orm/core'
import { Product } from '../product/product.entity'

@Entity()
export class Tag {
  constructor(tag: string) {
    this.tag = tag
  }

  @PrimaryKey()
  id!: number

  @Property({ unique: true })
  tag: string
}

export interface TagDto extends EntityDTO<Tag> {}