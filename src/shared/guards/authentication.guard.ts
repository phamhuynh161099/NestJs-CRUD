import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import envConfig from '../config';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY, AuthTypeDecoratorPayload } from '../decorators/auth.decorator';
import { AccessTokenGuard } from './access-token.guard';
import { ApiKeyGuard } from './api-key.guard';
import { AuthType, ConditionGuard } from '../constants/auth.constant';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    private readonly authTypeGuardMap: Record<string, CanActivate> = {
        [AuthType.Bearer]: this.accessTokenGuard,
        [AuthType.APIKey]: this.apiKeyGuard,
        [AuthType.None]: { canActivate: () => true }
    }

    constructor(private readonly reflector: Reflector,
        private readonly accessTokenGuard: AccessTokenGuard,
        private readonly apiKeyGuard: ApiKeyGuard
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const authTypeValue = this.reflector.getAllAndOverride<AuthTypeDecoratorPayload | undefined>(AUTH_TYPE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]) ?? { authTypes: [AuthType.None], options: { condition: ConditionGuard.And } };

        const guards = authTypeValue.authTypes.map((authType) => this.authTypeGuardMap[authType]);
        let error = new UnauthorizedException();
        if (authTypeValue.options.condition === ConditionGuard.Or) {
            for (const instance of guards) {
                const canActivate = await Promise.resolve(instance.canActivate(context)).catch(err => {
                    error = err;
                    return false;
                });
                if (canActivate) {
                    return true
                }
            }

            throw new UnauthorizedException()
        } else {
            for (const instance of guards) {
                const canActivate = await instance.canActivate(context);
                if (!canActivate) {
                    throw new UnauthorizedException()
                }
            }

            return true
        }


        return true;
    }
}
