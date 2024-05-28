import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { RequestContent } from './request-content.interface'
import { LoggerService } from '../services/logger.service'
import { config } from '../../config'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new LoggerService('HTTP')
  private id = 0

  private static requestContent: RequestContent = {
    params: true,
    query: true,
    body: true,
    headers: true,
    cookies: true,
    ip: true
  }

  static excludeFromRequest(content: Partial<RequestContent>) {
    for (const key of Object.keys(content)) {
      this.requestContent[key] = !content[key]
    }
  }

  use(request: Request, response: Response, next: NextFunction) {
    if (config.isTest) {
      next()
      return
    }
    
    this.logRequest(request)

    let responseBody: any
    const originalSend = response.send
    response.send = (body: any) => {
      responseBody = body
      return originalSend.call(response, body)
    }

    const startTime = Date.now()
    response.on('finish', () => {
      const duration = Date.now() - startTime
      const title = `[${this.id}] ${response.statusCode} ${request.originalUrl} ${duration}ms`
      this.logResponse(title, responseBody, response.statusCode)
      this.id++
    })

    next()
  }

  private logRequest(request: Request) {
    const { method, originalUrl } = request
    const title = `[${this.id}] ${method} ${originalUrl}`

    const content: Partial<Request> = {}
    const iterable = Object.entries(LoggerMiddleware.requestContent)
    for (const [key, value] of iterable) {
      if (value && key in request) {
        if (key === 'ip' && request.get('X-Forwarded-For')) {
          content[key] = request.get('X-Forwarded-For')
        } else {
          content[key] = request[key]
        }
      }
    }

    this.logger.log(title + ' ' + JSON.stringify(content))
  }

  private logResponse(title: string, response: any, statusCode: number) {
    if (statusCode >= 400) {
      this.logger.error(title + ' ' + response)
    } else {
      this.logger.log(title)
    }
  }
}
