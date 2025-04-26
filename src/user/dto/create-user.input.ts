// src/user/dto/create-user.input.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  firstName: string;

  @Field({ nullable: true }) 
  lastName?: string;  

  @Field()
  email: string;
}
