import { Property } from '@mikro-orm/core'
import { BaseEntity } from './base.entity'
export abstract class IikoEntity extends BaseEntity {
  @Property({ type: 'uuid', unique: true, hidden: true, lazy: true, nullable: true })
  iikoId?: string

  @Property({ nullable: true, hidden: true })
  order?: number

  @Property({ default: '' })
  additionalInfo?: string

  @Property({ default: false, hidden: true, lazy: true })
  isDeleted?: boolean

  get isCanSaleByTime(): boolean {
    try {
      const [startTime, endTime] = JSON.parse(this.additionalInfo ?? '[]')
      if (!startTime || !endTime) return true
      const [startHour, startMinute] = startTime.trim().split(':').map(Number)
      const [endHour, endMinute] = endTime.trim().split(':').map(Number)

      const currentTime = new Date()

      const currentHours = currentTime.getHours()
      const currentMinutes = currentTime.getMinutes()

      if (currentHours === startHour && currentMinutes >= startMinute) return true
      if (currentHours > startHour && currentHours < endHour) return true
      if (currentHours === endHour && currentMinutes < endMinute) return true

      return false
    } catch (e) {
      return true
    }
  }

  get isCanSaleByDay(): boolean {
    try {
      const [, , daysOfWeek] = JSON.parse(this.additionalInfo ?? '[]')
      const currentTime = new Date()
      const SUNDAY = 7
      const currentday = currentTime.getDay() || SUNDAY

      if (daysOfWeek) {
        const isSaleDay = (parseInt(String(daysOfWeek).split('').reverse().join(''), 2) >> (currentday - 1)) & 1
        return !!isSaleDay
      }

      return true
    } catch (e) {
      return true
    }
  }

  get startTime(): string {
    const [startTime] = JSON.parse(this.additionalInfo ?? '[]')
    return startTime
  }

  get endTime(): string {
    const [, endTime] = JSON.parse(this.additionalInfo ?? '[]')
    return endTime
  }

  get workingDays(): string {
    const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    try {
      const [, , daysOfWeek] = JSON.parse(this.additionalInfo ?? '[]')
      if (daysOfWeek) {
        return String(daysOfWeek)
          .split('')
          .reduce((result, current, idx) => {
            if (current === '1') {
              result.push(DAY_NAMES[idx])
            }
            return result
          }, new Array())
          .join(', ')
      }
      return ''
    } catch (e) {
      return ''
    }
  }
}
