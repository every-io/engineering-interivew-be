export class TaskNotFoundError extends Error {
    public constructor(message: string) {
      super(`[UpdateTasks] - ${message}`);
    }
}
  