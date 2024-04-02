import { Injectable } from '@nestjs/common'
import { EntityManager, } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Product } from './product.entity'
import { ProductRepository } from './product.repository'

@Injectable()
export class ProductService {

  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Product)
    private readonly productRepository: ProductRepository,
  ) {}

  // async bulkCreate() {
  //   // this.productRepository.insertMany
  // }

  async findAll() {
    return this.productRepository.findAll({ populate: ['group'] })
  }
}
