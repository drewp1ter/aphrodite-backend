import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { LoggerService } from '../shared/services/logger.service'
import * as api from './yookassa.api'
import { CreatePaymentResponseDto, PaymentProps, YookassaNotificationDto } from './yookassa.interface'

@Injectable()
export class YookassaService {
  logger = new LoggerService(YookassaService.name)

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async createPayment(props: PaymentProps): Promise<CreatePaymentResponseDto> {
    try {
      const paymentResponse = await api.payment(props)
      this.eventEmitter.emit('payment.created', paymentResponse)
      this.logger.log(`Pyment created id: ${paymentResponse.id}, amount: ${paymentResponse.amount.value}`)
      return paymentResponse
    } catch (e: unknown) {
      if (e instanceof Error) this.logger.error(e.message, e)
      throw e
    }
  }

  notification(dto: YookassaNotificationDto) {
    this.eventEmitter.emit(dto.event, dto.object)
    this.logger.log(`Event: ${dto.event}, id: ${dto.object.id}, amount: ${dto.object.amount.value}, metadata: ${JSON.stringify(dto.object.metadata)}`)
  }
}
