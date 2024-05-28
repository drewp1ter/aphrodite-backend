import { HttpStatus } from '@nestjs/common'
import { config } from '../config'

export async function sendMessage(text: string, chatId: string) {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  headers.append('Acceps', 'application/json')

  const res = await fetch(`https://api.telegram.org/bot${config.telegram.token}/sendMessage`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ chat_id: chatId, parse_mode: 'Markdown', text })
  })

  if (res.status >= HttpStatus.INTERNAL_SERVER_ERROR) {
    throw new Error(`Telegram api server error, status: ${res.status}`)
  }

  const responseBody = await res.json() as any

  if (res.status >= HttpStatus.BAD_REQUEST) {
    throw new Error(JSON.stringify(responseBody.description ?? responseBody))
  }

  return responseBody
}
