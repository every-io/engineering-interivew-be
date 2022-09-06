import { Field, Int, PartialType } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { CreateUserDTO } from './create-user.dto';

@InputType()
export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  @Field(() => Int)
  id: number;
}
