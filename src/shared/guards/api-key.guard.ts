import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import envConfig from '../config';

@Injectable()
export class ApiKeyGuard implements CanActivate {

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const xAPIKEY= request.headers['x-api-key'];

    if (xAPIKEY !== envConfig.SECRET_API_KEY) {
      throw new UnauthorizedException();
    }

    

    return true;
  }
}
