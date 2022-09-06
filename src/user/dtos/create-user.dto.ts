import { Field, HideField } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { GraphQLEmailAddress } from 'graphql-scalars';
import { IsBoolean, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateUserDTO {
  @Field(() => GraphQLEmailAddress, { nullable: false })
  email!: string;

  @Field(() => String, { nullable: false })
  @IsString()
  @MinLength(4)
  @MaxLength(6)
  @HideField()
  password!: string;

  @Field(() => String, { nullable: false })
  @IsString()
  name!: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  isAdmin?: boolean;

  // @Field(() => Date)
  @HideField()
  createdAt?: Date;

  // @Field(() => Date)
  @HideField()
  updateAt?: Date;
}
