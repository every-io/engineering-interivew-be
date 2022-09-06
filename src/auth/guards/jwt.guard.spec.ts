import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('GuardGuard', () => {
  let guard: JwtAuthGuard;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        JwtAuthGuard,
        {
          provide: JwtAuthGuard,
          useValue: {
            getRequest: jest.fn().mockReturnValue({
              headers: {
                authorization: 'providedToken',
              },
            }),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  it('should be defined', () => {
    expect(new JwtAuthGuard()).toBeDefined();
  });

  it('should return true when IS_PUBLIC_ROUTE is true', () => {
    const context = {
      getClass: jest.fn(),
      getHandler: jest.fn(),
      switchToHttp: jest.fn(() => ({})),
    } as any;

    const request = guard.getRequest(context);
    expect(request).toBeDefined();
    expect(request.headers.authorization).toBe('providedToken');
  });
});
