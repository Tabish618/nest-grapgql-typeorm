// src/user/user.entity.ts
import { ObjectType, Field} from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  firstName: string;

  @Field({ nullable: true })    
  @Column({ nullable: true }) 
  @IsOptional()
  @IsString()   
  lastName?: string;     

  @Field()
  @Column({ unique: true })
  email: string;
}
