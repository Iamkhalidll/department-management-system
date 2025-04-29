import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { SubDepartment } from '../../sub-departments/entities/sub-departments.entity';

@Entity()
@ObjectType()
export class Department {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @OneToMany(() => SubDepartment, subDepartment => subDepartment.department, {
    cascade: true,
    eager: true,
  })
  @Field(() => [SubDepartment], { nullable: true })
  subDepartments: SubDepartment[];
}