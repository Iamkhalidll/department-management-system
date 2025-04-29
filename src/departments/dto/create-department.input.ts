import { InputType, Field } from '@nestjs/graphql';
import { IsString, MinLength, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSubDepartmentInput } from '../../sub-departments/dto/create-sub-department.input';

@InputType()
export class CreateDepartmentInput {
  @Field()
  @IsString()
  @MinLength(2, { message: 'Department name must be at least 2 characters long' })
  name: string;

  @Field(() => [CreateSubDepartmentInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSubDepartmentInput)
  subDepartments?: CreateSubDepartmentInput[];
}