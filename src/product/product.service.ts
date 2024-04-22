import { Injectable } from '@nestjs/common'
import { EntityManager } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Product } from './product.entity'
import { ProductRepository } from './product.repository'
import { config } from '../config'
import { Category } from '../category/category.entity'

@Injectable()
export class ProductService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Product)
    private readonly productRepository: ProductRepository
  ) {}

  async findByCategoryId(categoryId: number) {
    return this.productRepository.findAll({ where: { category: categoryId, isDeleted: false }, orderBy: { order: 'ASC' }, populate: ['images'] })
  }

  async find({ query, page = 1, pageSize = config.defaultPageSize }: FindProps) {
    const offset = (page - 1) * pageSize
    return this.productRepository.findAll({
      where: { $or: [{ name: { $fulltext: query } }, { category: { name: { $fulltext: query } } }] },
      limit: pageSize,
      offset,
      populate: ['images']
    })
  }
}

export interface FindProps {
  query: string
  page?: number
  pageSize?: number
}
