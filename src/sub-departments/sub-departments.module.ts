import { Module } from '@nestjs/common';
import { SubDepartmentsService } from './sub-departments.service';
import { SubDepartmentsResolver } from './sub-departments.resolver';

@Module({
  providers: [SubDepartmentsResolver, SubDepartmentsService],
})
export class SubDepartmentsModule {}
