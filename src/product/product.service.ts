import { Injectable } from '@nestjs/common'
import { EntityManager } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Product } from './product.entity'
import { ProductRepository } from './product.repository'
import { config } from '../config'

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
    const _query = query.trim().toLocaleLowerCase()
    const tags = _query.split(' ')
    return this.productRepository.findAll({
      where: { $or: [{ name: { $fulltext: _query } }, { category: { name: { $fulltext: _query } } }, { tags: { tag: { $in: tags } } }] },
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
