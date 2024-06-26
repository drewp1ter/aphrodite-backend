import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { config } from '../config'
import { ROLES_KEY } from './roles.decorator'
import { RoleEnum } from './role.enum'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [context.getHandler(), context.getClass()])
    if (!requiredRoles) {
      return true
    }

    const req = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(req)
    
    if (!token) {
      throw new UnauthorizedException()
    }

    let user
    try {
      user = await this.jwtService.verifyAsync(token, {
        secret: config.jwt.secret
      })
      req.user = user
    } catch(e) {
      throw new UnauthorizedException()
    }

    return requiredRoles.some((role) => user?.roles?.includes(role))
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
