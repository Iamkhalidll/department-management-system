import { Injectable, UnauthorizedException, InternalServerErrorException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginInput } from './dto/login.input';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {
    // Initialize a default user for testing
    this.initializeDefaultUser().catch(error => {
      this.logger.error(`Failed to initialize default user: ${error.message}`, error.stack);
    });
  }

  private async initializeDefaultUser() {
    try {
      const userExists = await this.usersRepository.findOne({ 
        where: { username: 'admin' } 
      });
      
      if (!userExists) {
        try {
          const password = await argon2.hash('admin123', {
            type: argon2.argon2id,
            memoryCost: 65536, // 64 MiB
            timeCost: 3,
            parallelism: 1
          });
          const newUser = await this.usersRepository.save({
            username: 'admin',
            password,
          });
          this.logger.log(`Default admin user created with ID: ${newUser.id}`);
        } catch (error) {
          this.logger.error(`Failed to create default user: ${error.message}`, error.stack);
          if (error instanceof QueryFailedError) {
            throw new InternalServerErrorException('Database error while creating default user');
          }
          throw error;
        }
      } else {
        this.logger.log('Default admin user already exists');
      }
    } catch (error) {
      this.logger.error(`Error checking for default user: ${error.message}`, error.stack);
      if (error instanceof QueryFailedError) {
        throw new InternalServerErrorException('Database error while checking for default user');
      }
      throw error;
    }
  }

  async validateUser(username: string, password: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ 
        where: { username } 
      });
      
      if (!user) {
        this.logger.warn(`Login attempt with invalid username: ${username}`);
        throw new UnauthorizedException('Invalid credentials');
      }
      
      try {
        const isPasswordValid = await argon2.verify(user.password, password);
        
        if (!isPasswordValid) {
          this.logger.warn(`Failed login attempt for user: ${username}`);
          throw new UnauthorizedException('Invalid credentials');
        }
        
        this.logger.log(`User ${username} authenticated successfully`);
        return user;
      } catch (error) {
        if (error instanceof UnauthorizedException) {
          throw error;
        }
        this.logger.error(`Password validation error: ${error.message}`, error.stack);
        throw new InternalServerErrorException('Error during authentication');
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Error finding user ${username}: ${error.message}`, error.stack);
      
      if (error instanceof QueryFailedError) {
        throw new InternalServerErrorException('Database error during authentication');
      }
      throw error;
    }
  }

  async login(loginInput: LoginInput) {
    try {
      // validateUser already has error handling
      const user = await this.validateUser(
        loginInput.username,
        loginInput.password,
      );
      
      try {
        const payload = { username: user.username, sub: user.id };
        const token = this.jwtService.sign(payload);
        
        this.logger.log(`Generated JWT token for user: ${user.username}`);
        
        return {
          access_token: token,
          user,
        };
      } catch (error) {
        this.logger.error(`Failed to generate JWT token: ${error.message}`, error.stack);
        throw new InternalServerErrorException('Error generating authentication token');
      }
    } catch (error) {
      // Don't catch UnauthorizedException as it should be propagated
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      this.logger.error(`Login error: ${error.message}`, error.stack);
      throw error;
    }
  }
}