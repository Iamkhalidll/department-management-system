import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class UpdateDepartmentInput {
  @Field(() => ID)
  id: number;

  @Field()
  @IsString()
  @MinLength(2, { message: 'Department name must be at least 2 characters long' })
  name: string;
}