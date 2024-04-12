import { EntityRepository } from '@mikro-orm/mysql'
import { Product } from './product.entity'

export class ProductRepository extends EntityRepository<Product> {}
