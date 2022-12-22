import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { TaskRepositoryInterface } from '../../src/infrastructure/repositories/interfaces/task-repository.interface';
import request from 'supertest';
import { TaskStatus } from '../../src/domain/enums/task-status.enum';
import { expect } from 'chai';
import { Task } from '../../src/domain/entities/task.entity';
import { TaskData } from '../../src/infrastructure/repositories/mocks/task-data';
import { LoginResponseDto } from '../../src/domain/dtos/login-response.dto';

describe('Task', () => {
  let app: INestApplication;
  let taskRepository: TaskRepositoryInterface;

  before(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();

    taskRepository = app.get('TaskRepositoryInterface');

    await app.init();
  });

  after(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await taskRepository.resetTaskData();
  });

  afterEach(async () => {
    await taskRepository.resetTaskData();
  });

  context('test all features', () => {
    it('should create a new task, update one task and get all tasks', async () => {
        const originalData = TaskData.getMockTasks();

        const loginPostData = { name: 'Henrique Alves', password: 'henriquealves' };
        const responseLogin = await request(app.getHttpServer())
            .post('/login')
            .send(loginPostData);
        const loginResponse: LoginResponseDto = responseLogin.body;

        const response1 = await request(app.getHttpServer())
            .get('/tasks')
            .set({ 'x-access-token': loginResponse.token })
            .expect(HttpStatus.OK);
        
        const response1Body: Task[] = response1.body;
        const task1 = originalData.find(task => task.id == 1);
        const response1Task1 = response1Body.find(task => task.id == 1);
        expect(response1Body.length).to.be.equal(originalData.length);
        expect(response1Task1?.id).to.be.equal(task1?.id);
        expect(response1Task1?.title).to.be.equal(task1?.title);
        expect(response1Task1?.description).to.be.equal(task1?.description);
        expect(response1Task1?.status).to.be.equal(task1?.status);
        
        const postData = { title: 'Title test all features', description: 'Description test all features' };
        await request(app.getHttpServer())
            .post('/tasks')
            .set({ 'x-access-token': loginResponse.token })
            .send(postData)
            .expect(HttpStatus.CREATED);
        
        const putData = { title: 'New title', description: 'New description', status: TaskStatus.ARCHIVED };
        await request(app.getHttpServer())
            .put('/tasks/1')
            .set({ 'x-access-token': loginResponse.token })
            .send(putData)
            .expect(HttpStatus.OK);

        const response2 = await request(app.getHttpServer())
            .get('/tasks')
            .set({ 'x-access-token': loginResponse.token })
            .expect(HttpStatus.OK);

        const response2Body: Task[] = response2.body;
        const response2Task1 = response2Body.find(task => task.id == 1);
        expect(response2Body.length).to.be.equal(originalData.length + 1);
        expect(response2Task1?.id).to.be.equal(task1?.id);
        expect(response2Task1?.title).to.be.equal(putData.title);
        expect(response2Task1?.description).to.be.equal(putData.description);
        expect(response2Task1?.status).to.be.equal(putData.status);
    });
  });

  context('when is a read-only user', () => {
    it('should not create and update tasks', async () => {
        const loginPostData = { name: 'User Read', password: 'userread' };
        const responseLogin = await request(app.getHttpServer())
            .post('/login')
            .send(loginPostData);
        const loginResponse: LoginResponseDto = responseLogin.body;

        await request(app.getHttpServer())
            .get('/tasks')
            .set({ 'x-access-token': loginResponse.token })
            .expect(HttpStatus.OK);
        
        const postData = { title: 'Title test all features', description: 'Description test all features' };
        await request(app.getHttpServer())
            .post('/tasks')
            .set({ 'x-access-token': loginResponse.token })
            .send(postData)
            .expect(HttpStatus.FORBIDDEN);
        
        const putData = { title: 'New title', description: 'New description', status: TaskStatus.ARCHIVED };
        await request(app.getHttpServer())
            .put('/tasks/1')
            .set({ 'x-access-token': loginResponse.token })
            .send(putData)
            .expect(HttpStatus.FORBIDDEN);
    });
  });

  context('when is a write-only user', () => {
    it('should not get tasks', async () => {
        const loginPostData = { name: 'User Write', password: 'userwrite' };
        const responseLogin = await request(app.getHttpServer())
            .post('/login')
            .send(loginPostData);
        const loginResponse: LoginResponseDto = responseLogin.body;

        await request(app.getHttpServer())
            .get('/tasks')
            .set({ 'x-access-token': loginResponse.token })
            .expect(HttpStatus.FORBIDDEN);
        
        const postData = { title: 'Title test all features', description: 'Description test all features' };
        await request(app.getHttpServer())
            .post('/tasks')
            .set({ 'x-access-token': loginResponse.token })
            .send(postData)
            .expect(HttpStatus.CREATED);
        
        const putData = { title: 'New title', description: 'New description', status: TaskStatus.ARCHIVED };
        await request(app.getHttpServer())
            .put('/tasks/1')
            .set({ 'x-access-token': loginResponse.token })
            .send(putData)
            .expect(HttpStatus.OK);
    });
  });

  context('when is a invalid token', () => {
    it('should not get, create and update tasks', async () => {
        await request(app.getHttpServer())
            .get('/tasks')
            .set({ 'x-access-token': 'token' })
            .expect(HttpStatus.INTERNAL_SERVER_ERROR);
        
        const postData = { title: 'Title test all features', description: 'Description test all features' };
        await request(app.getHttpServer())
            .post('/tasks')
            .set({ 'x-access-token': 'token' })
            .send(postData)
            .expect(HttpStatus.INTERNAL_SERVER_ERROR);
        
        const putData = { title: 'New title', description: 'New description', status: TaskStatus.ARCHIVED };
        await request(app.getHttpServer())
            .put('/tasks/1')
            .set({ 'x-access-token': 'token' })
            .send(putData)
            .expect(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
