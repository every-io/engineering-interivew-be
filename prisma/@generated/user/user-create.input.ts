import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import * as Scalars from 'graphql-scalars';
import * as Validator from 'class-validator';
import { HideField } from '@nestjs/graphql';
import { TaskCreateNestedManyWithoutUserInput } from '../task/task-create-nested-many-without-user.input';

@InputType()
export class UserCreateInput {

    @Field(() => Scalars.GraphQLEmailAddress, {nullable:false})
    email!: string;

    @Field(() => String, {nullable:false})
    @Validator.IsString()
    @Validator.MinLength(4)
    @Validator.MaxLength(6)
    password!: string;

    @Field(() => String, {nullable:false})
    @Validator.IsString()
    name!: string;

    @Field(() => Boolean, {nullable:true})
    @Validator.IsBoolean()
    isAdmin?: boolean;

    @HideField()
    createdAt?: Date | string;

    @HideField()
    updateAt?: Date | string;

    @HideField()
    tasks?: TaskCreateNestedManyWithoutUserInput;
}
