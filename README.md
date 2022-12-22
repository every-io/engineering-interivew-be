# Task application

## Running the app

### Start app in dev mode (inside Docker container)

Before starting, remember to have docker up and running in your machine

1. Enter image console: `make shell`
2. Start app in debug mode: `npm run dev`
3. Check the app running at `localhost:3000` :tada:
4. You can test using Postman
5. First it is necessary to login using this endpoint `http://localhost:3000/login`. JSON body example `{"name": "Barry Peterson", "password": "barrypeterson"}`
6. There are other users with different roles in the file `src/infrastructure/repositories/mocks/login-data.ts`
7. After login you can call controller `src/application/controllers/task.controller.ts` endpoints. Need to add `x-access-token` header with token returned in login call
8. GET endpoint `http://localhost:3000/tasks` to get all tasks
9. POST endpoint `http://localhost:3000/tasks` to create a new task. Need JSON body
10. PUT endpoint `http://localhost:3000/tasks/{taskId}` to update a task. Need JSON body

## Testing

Unit tests and integration test

Just run the command below:

```bash
npm run test
```

## Considerations

1. Mock data was used to simplify so no database was created
2. Authentication and authorization are only covered by integration test
3. Reading and writing roles were considered
4. UseGuards was used for authentication and authorization
5. Logging was not considered due to the exercise submission deadline