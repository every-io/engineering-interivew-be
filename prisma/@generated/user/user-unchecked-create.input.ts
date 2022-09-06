import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { HideField } from '@nestjs/graphql';
import * as Scalars from 'graphql-scalars';
import * as Validator from 'class-validator';
import { TaskUncheckedCreateNestedManyWithoutUserInput } from '../task/task-unchecked-create-nested-many-without-user.input';

@InputType()
export class UserUncheckedCreateInput {

    @HideField()
    id?: number;

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
    tasks?: TaskUncheckedCreateNestedManyWithoutUserInput;
}
