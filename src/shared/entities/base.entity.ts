import { PrimaryKey, Property } from '@mikro-orm/core'

export abstract class BaseEntity {
  @PrimaryKey()
  id!: number

  @Property({ serializer: value => value.toISOString() })
  createdAt = new Date()

  @Property({ onUpdate: () => new Date(), serializer: value => value.toISOString() })
  updatedAt = new Date()
}
