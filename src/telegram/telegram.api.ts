import { config } from '../config'

export async function sendMessage(text: string) {
  const res = await fetch(`https://api.telegram.org/bot${config.telegram.token}/sendMessage`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json'
    },
    body: JSON.stringify({ chat_id: config.telegram.chatId, parse_mode: 'Markdown', text })
  })

  if (!res.ok) throw new Error(res.statusText)

  return res.json()
}
