import { Module } from '@nestjs/common';
import { RolesGuard } from './guards/roles.guard';

@Module({
  providers: [RolesGuard],
})
export class SharedModule {}
