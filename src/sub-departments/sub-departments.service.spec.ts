import { Test, TestingModule } from '@nestjs/testing';
import { SubDepartmentsService } from './sub-departments.service';

describe('SubDepartmentsService', () => {
  let service: SubDepartmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubDepartmentsService],
    }).compile();

    service = module.get<SubDepartmentsService>(SubDepartmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
