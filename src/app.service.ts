import { Injectable } from '@nestjs/common';
import envConfig from './shared/config';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('env', envConfig);
    return 'Hello World!';
  }
}
