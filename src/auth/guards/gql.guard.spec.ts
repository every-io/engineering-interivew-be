import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { GqlAuthGuard } from './gql-auth.guard';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import * as Chance from 'chance';
import { User } from '@prismaConfig/@generated/user/user.model';

const chance = new Chance();

const user: User = {
  id: chance.integer({ min: 1 }),
  name: chance.word(),
  email: chance.email(),
  password: chance.word(),
  isAdmin: chance.bool(),
  createdAt: chance.date(),
  updateAt: chance.date(),
};

describe('GqlAuthGuard', () => {
  let guard: GqlAuthGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        GqlAuthGuard,
        {
          provide: GqlAuthGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
            getRequest: jest.fn().mockReturnValue({
              body: {
                loginInputRequest: {
                  user: user,
                },
              },
            }),
          },
        },
      ],
    }).compile();

    guard = module.get<GqlAuthGuard>(GqlAuthGuard);
  });

  it('should be defined', () => {
    expect(new GqlAuthGuard()).toBeDefined();
  });

  it('should be able to can activate', () => {
    const context = createMock<ExecutionContext>();
    const canActivate = guard.canActivate(context);

    expect(canActivate).toBe(true);
  });

  it('should be able to get the user in context ', () => {
    const context = createMock<ExecutionContext>();
    const request = guard.getRequest(context);

    const contextUser = request.body.loginInputRequest.user;
    expect(contextUser).toBeDefined();
    expect(contextUser.id).toBe(user.id);
    expect(contextUser.name).toBe(user.name);
    expect(contextUser.email).toBe(user.email);
    expect(contextUser.password).toBe(user.password);
    expect(contextUser.isAdmin).toBe(user.isAdmin);
  });
});
