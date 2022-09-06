import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';
import * as NG from '@nestjs/graphql';
import { HideField } from '@nestjs/graphql';
import { Task } from '../task/task.model';
import { UserCount } from './user-count.output';

@ObjectType()
export class User {

    @Field(() => ID, {nullable:false})
    id!: number;

    @Field(() => String, {nullable:false})
    @NG.Directive('@key(fields: "email")')
    email!: string;

    @HideField()
    password!: string;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => Boolean, {nullable:true,defaultValue:false})
    isAdmin!: boolean | null;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updateAt!: Date;

    @Field(() => [Task], {nullable:true})
    tasks?: Array<Task>;

    @Field(() => UserCount, {nullable:false})
    _count?: UserCount;
}
