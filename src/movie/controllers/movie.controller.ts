import { Controller, Get } from '@nestjs/common';

@Controller('movie')
export class MovieController {
  @Get()
  async hello() {
    return { message: 'hello from movie controller' };
  }
}
