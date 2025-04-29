import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Department } from '../../departments/entities/department.entity';

@Entity()
@ObjectType()
export class SubDepartment {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @ManyToOne(() => Department, department => department.subDepartments, {
    onDelete: 'CASCADE',
  })
  department: Department;
}