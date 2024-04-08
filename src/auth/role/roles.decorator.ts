import { SetMetadata } from '@nestjs/common'
import { Role } from './role.enum'

type RoleUnion = `${Role}`
export const ROLES_KEY = 'roles'
export const Roles = (...roles: RoleUnion[]) => SetMetadata(ROLES_KEY, roles)
