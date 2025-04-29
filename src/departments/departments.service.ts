import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Department } from './entities/department.entity';
import { SubDepartment } from '../sub-departments/entities/sub-departments.entity';
import { CreateDepartmentInput } from './dto/create-department.input';
import { UpdateDepartmentInput } from './dto/update-department.input';

@Injectable()
export class DepartmentsService {
  private readonly logger = new Logger(DepartmentsService.name);

  constructor(
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
    @InjectRepository(SubDepartment)
    private subDepartmentsRepository: Repository<SubDepartment>,
  ) {}

  async create(createDepartmentInput: CreateDepartmentInput): Promise<Department> {
    try {
      // Create the department entity
      const department = this.departmentsRepository.create({
        name: createDepartmentInput.name,
      });

      // Save the department first to get its ID
      const savedDepartment = await this.departmentsRepository.save(department);
      this.logger.log(`Department created with ID: ${savedDepartment.id}`);

      // If sub-departments are provided, create them
      if (createDepartmentInput.subDepartments && createDepartmentInput.subDepartments.length > 0) {
        try {
          const subDepartments = createDepartmentInput.subDepartments.map(subDeptInput => {
            return this.subDepartmentsRepository.create({
              name: subDeptInput.name,
              department: savedDepartment,
            });
          });

          // Save all sub-departments
          const savedSubDepartments = await this.subDepartmentsRepository.save(subDepartments);
          savedDepartment.subDepartments = savedSubDepartments;
          this.logger.log(`Created ${savedSubDepartments.length} sub-departments for department ID: ${savedDepartment.id}`);
        } catch (error) {
          // If saving sub-departments fails, we should delete the department
          await this.departmentsRepository.delete(savedDepartment.id);
          
          this.logger.error(`Failed to create sub-departments: ${error.message}`, error.stack);
          
          if (error instanceof QueryFailedError) {
            throw new InternalServerErrorException('Database error while creating sub-departments');
          }
          throw error;
        }
      } else {
        savedDepartment.subDepartments = [];
      }

      return savedDepartment;
    } catch (error) {
      this.logger.error(`Failed to create department: ${error.message}`, error.stack);
      
      if (error instanceof QueryFailedError) {
        throw new InternalServerErrorException('Database error while creating department');
      }
      throw error;
    }
  }

  async findAll(page = 1, limit = 10): Promise<{ departments: Department[]; total: number }> {
    try {
      // Validate pagination parameters
      if (page < 1) {
        page = 1;
      }
      if (limit < 1 || limit > 100) {
        limit = 10;
      }

      const [departments, total] = await this.departmentsRepository.findAndCount({
        relations: ['subDepartments'],
        skip: (page - 1) * limit,
        take: limit,
        order: { id: 'ASC' }, // Add consistent ordering
      });

      this.logger.log(`Retrieved ${departments.length} departments (page ${page}, limit ${limit})`);
      return { departments, total };
    } catch (error) {
      this.logger.error(`Failed to fetch departments: ${error.message}`, error.stack);
      
      if (error instanceof QueryFailedError) {
        throw new InternalServerErrorException('Database error while fetching departments');
      }
      throw error;
    }
  }

  async findOne(id: number): Promise<Department> {
    try {
      const department = await this.departmentsRepository.findOne({
        where: { id },
        relations: ['subDepartments'],
      });

      if (!department) {
        this.logger.warn(`Department with ID ${id} not found`);
        throw new NotFoundException(`Department with ID ${id} not found`);
      }

      return department;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      this.logger.error(`Error retrieving department ${id}: ${error.message}`, error.stack);
      
      if (error instanceof QueryFailedError) {
        throw new InternalServerErrorException(`Database error while fetching department with ID ${id}`);
      }
      throw error;
    }
  }

  async update(id: number, updateDepartmentInput: UpdateDepartmentInput): Promise<Department> {
    try {
      // findOne already has error handling
      const department = await this.findOne(id);
      
      department.name = updateDepartmentInput.name;
      
      const updated = await this.departmentsRepository.save(department);
      this.logger.log(`Department ${id} updated successfully`);
      
      return updated;
    } catch (error) {
      // Don't catch NotFoundException as it's handled in findOne
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      this.logger.error(`Failed to update department ${id}: ${error.message}`, error.stack);
      
      if (error instanceof QueryFailedError) {
        throw new InternalServerErrorException(`Database error while updating department with ID ${id}`);
      }
      throw error;
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      // findOne already has error handling
      const department = await this.findOne(id);
      
      // This will cascade delete all sub-departments due to our entity relationships
      await this.departmentsRepository.remove(department);
      
      this.logger.log(`Department ${id} and its sub-departments deleted successfully`);
      return true;
    } catch (error) {
      // Don't catch NotFoundException as it's handled in findOne
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      this.logger.error(`Failed to delete department ${id}: ${error.message}`, error.stack);
      
      if (error instanceof QueryFailedError) {
        throw new InternalServerErrorException(`Database error while deleting department with ID ${id}`);
      }
      throw error;
    }
  }
}