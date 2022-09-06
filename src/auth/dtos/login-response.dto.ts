import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@prismaConfig/@generated/user/user.model';

@ObjectType()
export class LoginResponseDTO {
  @Field()
  access_token: string;

  @Field()
  user: User;
}
