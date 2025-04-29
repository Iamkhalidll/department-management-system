import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class UpdateSubDepartmentInput {
  @Field(() => ID)
  id: number;

  @Field()
  @IsString()
  @MinLength(2, { message: 'Sub-department name must be at least 2 characters long' })
  name: string;
}