import { Injectable } from '@nestjs/common'
import { EntityManager, } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { ProductGroup } from './product-group.entity'
import { ProductGroupRepository } from './product-group.repository'

@Injectable()
export class ProductService {

  constructor(
    private readonly em: EntityManager,
    @InjectRepository(ProductGroup)
    private readonly productGroupRepository: ProductGroupRepository,
  ) {}

  async findAll() {
    return this.productGroupRepository.findAll({ populate: ['products'] })
  }
}
