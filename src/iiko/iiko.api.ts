// documentation: https://api-ru.iiko.services/

import { fetchAbsolute } from '../shared/helpers'
import { INomenclature } from './iiko.interface'

const baseUrl = 'https://api-ru.iiko.services/api/1'
const fetchIiko = fetchAbsolute(baseUrl)

export async function accessToken(apiLogin: string): Promise<string> {
  const res = await fetchIiko('/access_token', { method: 'POST', body: JSON.stringify({ apiLogin }) })
  if (!res.ok) throw new Error('Failed to fetch access token.')
  try {
    const parsed = await res.json() as any
    return parsed.token
  } catch(e) {
    throw new SyntaxError('Failed to parse response of access token.')
  }
}

export async function nomenclature(accessToken: string) {
  const res = await fetchIiko('/nomenclature', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  if (!res.ok) throw new Error('Failed to fetch nomenclature')
  try {
    return res.json() as unknown as INomenclature
  } catch (e) {
    throw new SyntaxError('Failed to parse response of nomenclature.')
  }
}
