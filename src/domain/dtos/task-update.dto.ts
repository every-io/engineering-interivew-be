import { TaskStatus } from '../enums/task-status.enum';

export class TaskUpdateDto {
    readonly title?: string;
    readonly description?: string;
    readonly status?: TaskStatus;
  }