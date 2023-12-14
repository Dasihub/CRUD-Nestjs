import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Observable } from 'rxjs'

export class UserGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const res = context.switchToHttp().getRequest()

		const { authorization } = res.headers

		if (!authorization) {
			throw new UnauthorizedException({ message: 'Вы не авторизованы', type: 'error', data: [] })
		}

		const [title, token] = authorization.split(' ')

		if (title === 'Bearer' && token.length) {
			return true
		}

		throw new UnauthorizedException({ message: 'Вы не авторизованы', type: 'error', data: [] })
	}
}
