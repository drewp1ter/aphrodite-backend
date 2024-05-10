import { HttpException } from '@nestjs/common'
import { fetchAbsolute } from '../shared/helpers'
import { config } from '../config'
import { CreatePaymentRequestDto, PaymentProps, CreatePaymentResponseDto } from './yookassa.interface'

const baseUrl = 'https://api.yookassa.ru/v3'
const fetchYoomoney = fetchAbsolute(baseUrl)

export async function payment({ amount, idempotenceKey, description, metadata }: PaymentProps): Promise<CreatePaymentResponseDto> {
  const headers = new Headers()
  headers.set('Content-Type', 'application/json')
  headers.set('Authorization', `Basic ${Buffer.from(`${config.yookassa.shopId}:${config.yookassa.secretKey}`).toString('base64')}`)
  headers.set('Idempotence-Key', idempotenceKey)

  const body: CreatePaymentRequestDto = {
    amount: { value: amount, currency: 'RUB' },
    capture: true,
    confirmation: {
      type: 'redirect',
      return_url: config.thankYouPage,
    },
    description,
    metadata
  }

  const res = await fetchYoomoney('/payments', {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  })
  
  if (!res.ok) throw new HttpException('Unexpected payment error', res.status)
  try {
    return res.json() as Promise<CreatePaymentResponseDto>
  } catch (e) {
    throw new SyntaxError('Failed to parse response of YooKassa')
  }
}
