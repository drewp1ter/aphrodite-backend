import { PrimaryKey, Property, sql } from '@mikro-orm/core'

export abstract class BaseEntity {
  @PrimaryKey()
  id!: number

  @Property({ default: sql.now(), serializer: value => value?.toISOString() })
  createdAt?: Date

  @Property({ default: sql.now(), onUpdate: () => new Date(), serializer: value => value?.toISOString() })
  updatedAt?: Date
}
