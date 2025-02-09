import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  count: number = 0;

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    this.count++;
    console.warn('count', this.count);
    return this.appService.getHello();
  }
}
