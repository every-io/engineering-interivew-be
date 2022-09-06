import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import * as Chance from 'chance';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { PrismaService } from '@/prisma.service';
import { User } from '@prismaConfig/@generated/user/user.model';

const chance = new Chance();
const GLOBAL_USER_ID = 123;

let fakeAdminUser: User;

const createUserInput: CreateUserDTO = {
  name: chance.first(),
  email: chance.email(),
  password: chance.string({ length: 15 }),
  isAdmin: chance.bool(),
};

const updateUserInput: UpdateUserDTO = {
  id: GLOBAL_USER_ID,
  name: chance.first(),
  email: chance.email(),
};

const fakeUsers: User[] = [];

const populateFakeArray = () => {
  for (let i = 1; i < 10; i++) {
    const user = {
      id: i,
      email: chance.email(),
      name: chance.first(),
      password: chance.string({ length: 15 }),
      isAdmin: chance.bool(),
      createdAt: chance.date(),
      updateAt: chance.date(),
    } as User;

    fakeUsers.push(user);
  }
};

describe('UsersService', () => {
  let service: UserService;
  let prismaService: PrismaService;
  let module: TestingModule;

  beforeAll(async () => {
    populateFakeArray();
    module = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(() => {
    fakeAdminUser = {
      id: GLOBAL_USER_ID,
      email: chance.email(),
      name: chance.first(),
      password: chance.string({ length: 15 }),
      isAdmin: true,
      createdAt: chance.date(),
      updateAt: chance.date(),
    } as User;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  it('should get a list of users', async () => {
    prismaService.user.findMany = jest.fn().mockReturnValue(fakeUsers);

    const users = await service.findAll();
    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(9);
    expect(users[0].name).toBe(fakeUsers[0].name);
    expect(users[0].email).toBe(fakeUsers[0].email);
    expect(users[0].password).toBe(fakeUsers[0].password);
    expect(users[0].isAdmin).toBe(fakeUsers[0].isAdmin);
  });

  it('should get the user', async () => {
    prismaService.user.findUnique = jest
      .fn()
      .mockReturnValueOnce(fakeAdminUser);

    const user = await service.findOne(GLOBAL_USER_ID);
    expect(user.id).toBe(GLOBAL_USER_ID);
    expect(user.name).toBe(fakeAdminUser.name);
    expect(user.email).toBe(fakeAdminUser.email);
    expect(user.password).toBe(fakeAdminUser.password);
    expect(user.isAdmin).toBe(fakeAdminUser.isAdmin);
  });

  // it('should not bet able to get the user if user is non admin', async () => {
  //   prismaService.user.findUnique = jest
  //     .fn()
  //     .mockReturnValueOnce(fakeNonAdminUser);

  //   const user = await service.findOne(GLOBAL_USER_ID);
  //   expect(user.id).toBe(GLOBAL_USER_ID);
  //   expect(user.name).toBe(fakeNonAdminUser.name);
  //   expect(user.email).not.toBe(fakeNonAdminUser.email);
  //   expect(user.password).toBe(fakeNonAdminUser.password);
  //   expect(user.isAdmin).not.toBe(fakeNonAdminUser.isAdmin);
  // });

  it('should update some user properties', async () => {
    prismaService.user.update = jest
      .fn()
      .mockReturnValueOnce({ id: GLOBAL_USER_ID, ...updateUserInput });

    updateUserInput.id = GLOBAL_USER_ID;
    const updatedUser = await service.update(
      updateUserInput.id,
      updateUserInput,
    );
    expect(updatedUser.id).toBe(GLOBAL_USER_ID);
    expect(updatedUser.name).toBe(updateUserInput.name);
    expect(updatedUser.email).not.toBe(createUserInput.email);
    expect(updatedUser.password).toBe(updateUserInput.password);
    expect(updatedUser.isAdmin).not.toBe(createUserInput.isAdmin);
  });

  it('should be able to find one by email', async () => {
    const randomUserId = Math.floor(Math.random() * 9);

    prismaService.user.findUnique = jest
      .fn()
      .mockReturnValueOnce(fakeUsers[randomUserId]);

    const user = await service.findByEmail(fakeUsers[randomUserId].email);
    expect(user).toBeDefined();
    expect(user.id).toBe(fakeUsers[randomUserId].id);
    expect(user.name).toBe(fakeUsers[randomUserId].name);
    expect(user.isAdmin).toBe(fakeUsers[randomUserId].isAdmin);
  });

  it('should delete the testing user', async () => {
    const userId = fakeUsers[0].id;
    prismaService.user.delete = jest
      .fn()
      .mockReturnValueOnce(fakeUsers.find((user) => user.id === userId));

    const deletedUser = await service.remove(GLOBAL_USER_ID);
    expect(deletedUser).toBeDefined();
  });

  it('should not be able to find one by email', async () => {
    prismaService.user.findUnique = jest
      .fn()
      .mockReturnValueOnce(fakeAdminUser);

    try {
      await service.findByEmail(createUserInput.email);
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.response).toBeDefined();
      expect(err.response.statusCode).toBe(404);
    }
  });

  it('should not be able to update an non existing user', async () => {
    try {
      await service.update(GLOBAL_USER_ID, updateUserInput);
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.response).toBeDefined();
      expect(err.response.statusCode).toBe(404);
    }
  });
});
