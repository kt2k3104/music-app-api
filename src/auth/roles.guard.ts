import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requireRole = this.reflector.getAllAndOverride<string>('role', [
      context.getHandler(),
      context.getClass()
    ])

    if (!requireRole) {
      return true
    }

    const { user } = context.switchToHttp().getRequest()

    console.log(user)
    console.log(requireRole)

    return user.role === requireRole
  }
}
