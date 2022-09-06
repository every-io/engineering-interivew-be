import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import * as Chance from 'chance';
import { CreateUserDTO } from '@user/dtos/create-user.dto';
import { LoginRequestDTO } from './dtos/login-request.dto';
import { CONTEXT, GraphQLExecutionContext } from '@nestjs/graphql';
import { User } from '@prismaConfig/@generated/user/user.model';

const chance = new Chance();
const GLOBAL_USER_ID = 123;
const createUserInput: CreateUserDTO = {
  name: chance.first(),
  email: chance.email(),
  password: chance.string({ length: 15 }),
  isAdmin: chance.bool(),
};

const user: User = {
  id: chance.integer({ min: 1, max: 1000 }),
  email: chance.email(),
  name: chance.first(),
  password: chance.string({ length: 15 }),
  isAdmin: chance.bool(),
  createdAt: chance.date(),
  updateAt: chance.date(),
};

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let context: GraphQLExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(() => {
              return {
                id: GLOBAL_USER_ID,
                ...createUserInput,
              };
            }),
            login: jest.fn(() => {
              return { access_token: '' };
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

    resolver = module.get<AuthResolver>(AuthResolver);
    context = module.get<GraphQLExecutionContext>(CONTEXT);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
    expect(context).toBeDefined();
  });

  it('should be able to create an user', async () => {
    const user = await resolver.signUp(createUserInput);
    expect(user.id).toBeDefined();
    expect(user.id).toBe(GLOBAL_USER_ID);
    expect(user.name).toBe(createUserInput.name);
    expect(user.email).toBe(createUserInput.email);
    expect(user.password).toBe(createUserInput.password);
    expect(user.isAdmin).toBe(createUserInput.isAdmin);
  });

  it('should be able generate an access token', async () => {
    const loginUserInput: LoginRequestDTO = {
      email: createUserInput.email,
      password: createUserInput.password,
    };
    const { access_token } = await resolver.login(loginUserInput);
    expect(access_token).toBeDefined();
  });
});
