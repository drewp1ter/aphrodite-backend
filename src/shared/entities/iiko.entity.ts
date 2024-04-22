import { Property } from '@mikro-orm/core'
import { BaseEntity } from './base.entity'

export abstract class IikoEntity extends BaseEntity {
  @Property({ type: 'uuid', unique: true, hidden: true, lazy: true, nullable: true })
  iikoId?: string

  @Property({ nullable: true, hidden: true })
  order?: number
  
  @Property({ default: false, hidden: true, lazy: true })
  isDeleted?: boolean
}
