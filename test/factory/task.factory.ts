import faker from 'faker';
import { Factory } from 'rosie';
import { Task } from '../../src/domain/entities/task.entity';
import { TaskStatus } from '../../src/domain/enums/task-status.enum';

export const TaskFactory = new Factory<Task>()
  .attr('id', faker.datatype.number())
  .attr('title', faker.datatype.string())
  .attr('description', faker.datatype.string())
  .attr('status', TaskStatus.TO_DO);