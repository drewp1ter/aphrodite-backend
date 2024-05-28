import { EntityRepository } from '@mikro-orm/mysql'
import { DeliveryPrice } from './delivery-price.entity'

export class DeliveryPriceRepository extends EntityRepository<DeliveryPrice> {}
