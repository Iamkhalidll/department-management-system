import { Controller, Get,Head } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

@Controller()
export class HealthController {
  @Get()
  healthCheck() {
    return { status: 'ok' };
  }

  @Head()
  headHealthCheck() {
    // Empty response for HEAD requests
    return '';
  }
}
