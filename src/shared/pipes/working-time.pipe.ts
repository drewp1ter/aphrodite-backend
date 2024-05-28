import { ServiceUnavailableException, Injectable, PipeTransform } from '@nestjs/common'
import { LoggerService } from '../services/logger.service'
import { config } from '../../config'

@Injectable()
export class WorkingTimeValidationPipe implements PipeTransform<any> {
  logger = new LoggerService(WorkingTimeValidationPipe.name)
  start = config.workingHours.start?.trim().split(':').map(Number)
  end = config.workingHours.end?.trim().split(':').map(Number)

  async transform(value: any) {
    if (config.isTest) return value
    if (!this.start || !this.end) {
      this.logger.warn('Working time is not defined')
      return value
    }

    const [startHour, startMinute] = this.start
    const [endHour, endMinute] = this.end

    const currentTime = new Date()
    const currentHours = currentTime.getHours()
    const currentMinutes = currentTime.getMinutes()

    if (currentHours === startHour && currentMinutes >= startMinute) return value
    if (currentHours > startHour && currentHours < endHour) return value
    if (currentHours === endHour && currentMinutes < endMinute) return value

    this.logger.log('Order rejected')
    throw new ServiceUnavailableException(
      `Извините, но мы не можем принять ваш заказ.\nЗаказы принимаются с ${config.workingHours.start} до ${config.workingHours.end}`
    )
  }
}
