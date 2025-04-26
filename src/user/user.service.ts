// src/user/user.service.ts
import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(input: CreateUserInput): Promise<User> {
    try {
        const user = this.userRepository.create(input);
        return await this.userRepository.save(user);
      } catch (error) {
        if (error instanceof QueryFailedError) {
          if ((error as any).code === '23505') {
            throw new ConflictException('Email already registered.');
          }
        }
        throw new InternalServerErrorException('Something went wrong');
      }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    try {
        const user = await this.userRepository.findOne({ where: { id } });
    
       
        if (!user) {
          throw new HttpException(
            `User with id ${id} not found`,
            HttpStatus.NOT_FOUND
          );
        }
        return user;
      } catch (error) {
        
        if (error instanceof HttpException) {
         
          throw error;
        } else {
          
          throw new HttpException(
            'An unexpected error occurred while fetching the user.',
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
      }
  }

  async update(input: UpdateUserInput): Promise<User> {
    try {
        
        const existingUser = await this.userRepository.findOne({ where: { id: input.id } });
        
        
        if (!existingUser) {
          throw new HttpException(
            `User with id ${input.id} not found`,
            HttpStatus.NOT_FOUND
          );
        }
    
        await this.userRepository.update(input.id, input);
    
        return this.findOne(input.id);

      } catch (error) {
       
        if (error instanceof HttpException) {
          
          throw error;
        } else {
          
          throw new HttpException(
            'An unexpected error occurred while updating the user.',
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
      }
  }

  async remove(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
  
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
  
      await this.userRepository.delete(id);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // re-throw NotFoundException
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
