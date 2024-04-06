import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import jwt from 'jsonwebtoken'
import { SECRET } from '../config'

export const User = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()

  // if route is protected, there is a user set in auth.middleware
  if (!!request.user) {
    return !!data ? request.user[data] : request.user
  }

  // in case a route is not protected, we still want to get the optional auth user from jwt
  const [, token] = request.headers.authorization?.split(' ') ?? []

  if (token) {
    const decoded: any = jwt.verify(token, SECRET)
    return !!data ? decoded[data] : decoded.user
  }
})
