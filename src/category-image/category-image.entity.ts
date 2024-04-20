import { Entity, Property, ManyToOne, EntityDTO, wrap } from '@mikro-orm/core'
import { BaseEntity } from '../shared/entities/base.entity'
import { Category } from '../category/category.entity'

@Entity()
export class CategoryImage extends BaseEntity {
  @ManyToOne({ hidden: true })
  category!: Category

  @Property({ type: 'text' })
  url!: string

  @Property({ default: '' })
  type!: string

  constructor(partial: Partial<CategoryImage>) {
    super()
    Object.assign(this, partial)
  }

  toJSON() {
    return wrap<CategoryImage>(this).toObject() as CategoryImageDto
  }
}

export interface CategoryImageDto extends EntityDTO<CategoryImage> {}
