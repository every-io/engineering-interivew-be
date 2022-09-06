import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '@prismaConfig/@generated/user/user.model';
import { Chance } from 'chance';
import { UserService } from '@user/user.service';
import { CONTEXT, GraphQLExecutionContext } from '@nestjs/graphql';
import { CreateUserDTO } from '@/user/dtos/create-user.dto';
import { ConflictException } from '@nestjs/common';

const chance = new Chance();

const user: User = {
  id: chance.integer({ min: 1, max: 1000 }),
  email: chance.email(),
  name: chance.first(),
  password: chance.string({ length: 15 }),
  isAdmin: chance.bool(),
  createdAt: chance.date(),
  updateAt: chance.date(),
};
describe('AuthService', () => {
  let service: AuthService;
  let module: TestingModule;
  let context: GraphQLExecutionContext;
  let userService: UserService;
  const JWT_SECRET = chance.string({ length: 15 });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: JWT_SECRET })],
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(async (email) => {
              if (email) {
                const saltOrRounds = 10;
                const passwordHash = await bcrypt.hash(
                  user.password,
                  saltOrRounds,
                );
                return { ...user, password: passwordHash };
              } else {
                return null;
              }
            }),
          },
        },
        {
          provide: CONTEXT,
          useValue: {
            req: {
              user: user,
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    context = module.get<GraphQLExecutionContext>(CONTEXT);
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(context).toBeDefined();
  });

  it('should validate user credentials', async () => {
    const isUserValid = await service.validateUser(user.email, user.password);
    expect(isUserValid).toBeDefined();
    expect(isUserValid.email).toBe(user.email);
  });
  it('should not validate a non existent user', async () => {
    const isUserValid = await service.validateUser(null, user.password);
    expect(isUserValid).toBe(null);
  });

  it('should not validate user with invalid password', async () => {
    const isUserValid = await service.validateUser(
      user.email,
      'invalid password',
    );
    expect(isUserValid).toBe(null);
  });

  it('should be able to generate an access_token', async () => {
    const { access_token } = await service.login();
    expect(access_token).toBeDefined();
    expect(typeof access_token).toBe('string');
  });

  it('should be able to signup an user', async () => {
    const newUser: CreateUserDTO = {
      name: chance.name(),
      email: chance.email(),
      password: chance.word(),
    };

    const createdUser: User = {
      id: chance.integer({ min: 1 }),
      createdAt: chance.date(),
      updateAt: chance.date(),
      isAdmin: chance.bool(),
      ...newUser,
    };

    userService.findByEmail = jest.fn().mockReturnValueOnce(undefined);
    userService.create = jest.fn().mockReturnValueOnce(createdUser);
    const user = await service.signup(newUser);

    expect(user.id).toBeDefined();
    expect(user.id).toBe(createdUser.id);
    expect(user.name).toBe(createdUser.name);
    expect(user.email).toBe(createdUser.email);
    expect(user.password).toBe(createdUser.password);
    expect(user.isAdmin).toBe(createdUser.isAdmin);
  });

  it('should not be able to signup an user if the email is in use', async () => {
    const newUser: CreateUserDTO = {
      name: chance.name(),
      email: chance.email(),
      password: chance.word(),
    };

    const createdUser: User = {
      id: chance.integer({ min: 1 }),
      createdAt: chance.date(),
      updateAt: chance.date(),
      isAdmin: chance.bool(),
      ...newUser,
    };

    userService.findByEmail = jest.fn().mockReturnValueOnce(createdUser);
    userService.create = jest.fn().mockReturnValueOnce(createdUser);
    await expect(service.signup(newUser)).rejects.toThrow(ConflictException);
  });
});
