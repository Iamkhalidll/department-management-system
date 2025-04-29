import { Injectable } from '@nestjs/common';
import { CreateSubDepartmentInput } from './dto/create-sub-department.input';
import { UpdateSubDepartmentInput } from './dto/update-sub-department.input';

@Injectable()
export class SubDepartmentsService {
  create(createSubDepartmentInput: CreateSubDepartmentInput) {
    return 'This action adds a new subDepartment';
  }

  findAll() {
    return `This action returns all subDepartments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subDepartment`;
  }

  update(id: number, updateSubDepartmentInput: UpdateSubDepartmentInput) {
    return `This action updates a #${id} subDepartment`;
  }

  remove(id: number) {
    return `This action removes a #${id} subDepartment`;
  }
}
