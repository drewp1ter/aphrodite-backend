// documentation: https://api-ru.iiko.services/

import { HttpException, UnauthorizedException } from '@nestjs/common'
import { fetchAbsolute } from '../shared/helpers'
import { config } from '../config'
import { INomenclature } from './iiko.interface'

const baseUrl = 'https://api-ru.iiko.services/api/1'
const fetchIiko = fetchAbsolute(baseUrl)

export async function accessToken(): Promise<string> {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  const res = await fetchIiko('/access_token', {
    method: 'POST',
    headers,
    body: JSON.stringify({ apiLogin: config.iiko.apiLogin })
  })
  if (res.status === 401) throw new UnauthorizedException('API login is incorrect. Please check the environment variable IIKO_API_LOGIN')
  if (!res.ok) throw new HttpException('Unexpected Iiko API login error', res.status)
  try {
    const parsed = (await res.json()) as any
    return parsed.token
  } catch (e) {
    throw new SyntaxError('Failed to parse response of access token')
  }
}

export async function nomenclature(accessToken: string) {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  headers.append('Authorization', `Bearer ${accessToken}`)
  
  const res = await fetchIiko('/nomenclature', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      organizationId: config.iiko.organizationId,
      startRevision: 0
    })
  })
  if (res.status === 401) throw new UnauthorizedException('Iiko token is bad or expired. Please contact iiko technical support')
  if (!res.ok) throw new HttpException('Unexpected Iiko API nomenclature error', res.status)
  try {
    return res.json() as unknown as INomenclature
  } catch (e) {
    throw new SyntaxError('Failed to parse response of nomenclature')
  }
}
