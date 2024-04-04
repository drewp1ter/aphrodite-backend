import { Factory } from '@mikro-orm/seeder'
import { faker } from '@faker-js/faker'
import { Address } from './address.entity'

export class AddressFactory extends Factory<Address> {
  model = Address

  definition(): Partial<Address> {
    return {
      city: faker.location.city(),
      address: faker.location.streetAddress()
    }
  }
}
