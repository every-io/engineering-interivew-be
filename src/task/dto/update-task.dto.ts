import { CreateTaskDTO } from './create-task.dto';
import { InputType, Field, PartialType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateTaskDTO extends PartialType(CreateTaskDTO) {
  @Field(() => Int)
  id: number;
}
