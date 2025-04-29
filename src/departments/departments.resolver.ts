import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Department } from './entities/department.entity';
import { CreateDepartmentInput } from './dto/create-department.input';
import { UpdateDepartmentInput } from './dto/update-department.input';
import { JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';

@Resolver(() => Department)
export class DepartmentsResolver {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Mutation(() => Department)
  @UseGuards(JwtAuthGuard)
  createDepartment(
    @Args('input') createDepartmentInput: CreateDepartmentInput,
    @CurrentUser() user: User,
  ) {
    return this.departmentsService.create(createDepartmentInput);
  }

  @Query(() => PaginatedDepartments, { name: 'getDepartments' })
  @UseGuards(JwtAuthGuard)
  findAll(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @CurrentUser() user: User,
  ) {
    return this.departmentsService.findAll(page, limit);
  }

  @Query(() => Department, { name: 'department' })
  @UseGuards(JwtAuthGuard)
  findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ) {
    return this.departmentsService.findOne(id);
  }

  @Mutation(() => Department)
  @UseGuards(JwtAuthGuard)
  updateDepartment(
    @Args('input') updateDepartmentInput: UpdateDepartmentInput,
    @CurrentUser() user: User,
  ) {
    return this.departmentsService.update(
      updateDepartmentInput.id,
      updateDepartmentInput,
    );
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  deleteDepartment(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ) {
    return this.departmentsService.remove(id);
  }
}

import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class PaginatedDepartments {
  @Field(() => [Department])
  departments: Department[];

  @Field(() => Int)
  total: number;
}