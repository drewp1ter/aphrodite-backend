import { SetMetadata } from '@nestjs/common'
import { RoleEnum } from './role.enum'

type RoleUnion = `${RoleEnum}`
export const ROLES_KEY = 'roles'
export const Roles = (...roles: RoleUnion[]) => SetMetadata(ROLES_KEY, roles)
