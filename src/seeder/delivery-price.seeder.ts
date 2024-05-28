import { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { DeliveryPriceFactory } from '../delivery-price/delivery-price.factory'

export class DeliveryPriceSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {

    new DeliveryPriceFactory(em).make(10)

    await em.flush()
  }
}
