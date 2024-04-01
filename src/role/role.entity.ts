import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
export class Role {
  @PrimaryKey()
  id!: number

  @Property()
  role!: string
}
