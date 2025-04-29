import { Test, TestingModule } from '@nestjs/testing';
import { SubDepartmentsResolver } from './sub-departments.resolver';
import { SubDepartmentsService } from './sub-departments.service';

describe('SubDepartmentsResolver', () => {
  let resolver: SubDepartmentsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubDepartmentsResolver, SubDepartmentsService],
    }).compile();

    resolver = module.get<SubDepartmentsResolver>(SubDepartmentsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
