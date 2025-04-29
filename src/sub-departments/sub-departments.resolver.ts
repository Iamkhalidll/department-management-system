import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SubDepartmentsService } from './sub-departments.service';
import { SubDepartment } from '../sub-departments/entities/sub-departments.entity';
import { CreateSubDepartmentInput } from './dto/create-sub-department.input';
import { UpdateSubDepartmentInput } from './dto/update-sub-department.input';

@Resolver(() => SubDepartment)
export class SubDepartmentsResolver {
  constructor(private readonly subDepartmentsService: SubDepartmentsService) {}

  @Mutation(() => SubDepartment)
  createSubDepartment(@Args('createSubDepartmentInput') createSubDepartmentInput: CreateSubDepartmentInput) {
    return this.subDepartmentsService.create(createSubDepartmentInput);
  }

  @Query(() => [SubDepartment], { name: 'subDepartments' })
  findAll() {
    return this.subDepartmentsService.findAll();
  }

  @Query(() => SubDepartment, { name: 'subDepartment' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.subDepartmentsService.findOne(id);
  }

  @Mutation(() => SubDepartment)
  updateSubDepartment(@Args('updateSubDepartmentInput') updateSubDepartmentInput: UpdateSubDepartmentInput) {
    return this.subDepartmentsService.update(updateSubDepartmentInput.id, updateSubDepartmentInput);
  }

  @Mutation(() => SubDepartment)
  removeSubDepartment(@Args('id', { type: () => Int }) id: number) {
    return this.subDepartmentsService.remove(id);
  }
}
