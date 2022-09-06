import { InputType, Field, HideField, Int } from '@nestjs/graphql';
import { IsString } from 'class-validator';

export const enum Status {
  TO_DO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
  ARCHIVED = 'Archived',
}

@InputType()
export class CreateTaskDTO {
  @HideField()
  id?: number;

  @Field(() => String, { nullable: false })
  @IsString()
  name!: string;

  @Field(() => String, { nullable: true })
  @IsString()
  description?: string;

  @HideField()
  createdAt?: Date | string;

  @HideField()
  updateAt?: Date | string;

  @Field(() => Int, { nullable: true })
  @IsString()
  userId?: number;

  @Field(() => String, { nullable: true, defaultValue: Status.TO_DO })
  status: Status;
}
