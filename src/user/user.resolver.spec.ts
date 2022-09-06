import { Test, TestingModule } from '@nestjs/testing';
import * as Chance from 'chance';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

const chance = new Chance();
const GLOBAL_USER_ID = 123;

const createUserInput: CreateUserDTO = {
  name: chance.first(),
  email: chance.email(),
  password: chance.string({ length: 15 }),
  isAdmin: chance.bool(),
};

const updateUserInput: UpdateUserDTO = {
  id: GLOBAL_USER_ID,
  name: chance.last(),
  email: chance.first(),
  password: chance.string({ length: 15 }),
  isAdmin: chance.bool(),
};

describe('UsersResolver', () => {
  let userResolver: UserResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn(() => {
              return [
                {
                  id: GLOBAL_USER_ID,
                  ...createUserInput,
                },
              ];
            }),
            getUsers: jest.fn(() => {
              return {
                users: [
                  {
                    id: GLOBAL_USER_ID,
                    ...createUserInput,
                  },
                ],
                count: 1,
              };
            }),
            findOne: jest.fn(() => {
              return {
                id: GLOBAL_USER_ID,
                ...createUserInput,
              };
            }),
            update: jest.fn(() => {
              return {
                id: GLOBAL_USER_ID,
                ...createUserInput,
                ...updateUserInput,
              };
            }),
            remove: jest.fn(() => {
              return {};
            }),
            loginUser: jest.fn(() => {
              return { access_token: '' };
            }),
          },
        },
      ],
    }).compile();

    userResolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(userResolver).toBeDefined();
  });
  it('should be able to list all users', async () => {
    // const listUserInput: ListUsersInput = { limit: 10, offset: 0 };
    const users = await userResolver.findAll();
    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBe(true);
    expect(users[0].id).toBe(GLOBAL_USER_ID);
  });
  it('should be able to find one user by id', async () => {
    const user = await userResolver.findOne(GLOBAL_USER_ID);
    expect(user).toBeDefined();
    expect(user.id).toBe(GLOBAL_USER_ID);
  });
  it('should be able to test updateUser ', async () => {
    const updatedUser = await userResolver.updateUser(updateUserInput);
    expect(updatedUser).toBeDefined();
    expect(updatedUser.name).toBe(updateUserInput.name);
    expect(updatedUser.email).toBe(updateUserInput.email);
  });

  it('should be able to test removeUser ', async () => {
    const removedUser = await userResolver.removeUser(GLOBAL_USER_ID);
    expect(removedUser).toBeDefined();
  });
});
