export interface Amount {
  value: number
  currency: 'RUB'
}

export interface ConfirmationResponse {
  type: 'redirect',
  confirmation_url: string
}

export interface ConfirmationRequest {
  type: 'redirect',
  return_url: string
}

export interface Recipient {
  account_id: string,
  gateway_id: string
}

export interface PaymentProps {
  amount: number,
  description: string
  idempotenceKey: string
  metadata?: any
}

export interface CreatePaymentRequestDto {
  amount: Amount,
  capture: boolean,
  confirmation: ConfirmationRequest
  description: string
  metadata: any
}

export interface CreatePaymentResponseDto {
  id: string
  status: 'pending' | 'succeeded' | 'canceled',
  paid: boolean,
  amount: Amount,
  confirmation: ConfirmationResponse,
  created_at: Date
  description: string
  metadata: any,
  recipient: Recipient,
  refundable: boolean,
  test: boolean
}

export interface Recipient {
  account_id: string 
  gateway_id: string
}

export interface PaymentMethod {
  type: 'bank_card' | 'yoo_money',
  id: string,
  saved: boolean,
  title: string,
  card?: any
  account_number?: any
}

export interface AuthorizationDetails {
  rrn: string,
  auth_code: string,
  three_d_secure: string
}

export interface CancellationDetails { 
  party: 'yoo_money' 
  reason: 'expired_on_confirmation' 
}

export interface Payment {
  id: string
  status: 'succeeded' | 'canceled' | 'pending' | 'waiting_for_capture'
  amount: Amount
  income_amount?: Amount
  description: string
  recipient: Recipient
  payment_method: PaymentMethod
  captured_at?: Date
  created_at: Date
  test: boolean,
  refunded_amount?: Amount,
  paid: boolean,
  refundable: boolean,
  metadata: any
  authorization_details?: AuthorizationDetails
  cancellation_details?: CancellationDetails 
}

export interface YookassaNotificationDto {
  type: 'notification'
  event: 'payment.succeeded' | 'payment.canceled' | 'payment.waiting_for_capture' 
  object: Payment
}