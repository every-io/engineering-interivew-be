import { connectDb } from '@config/Db';
import { User } from '@entity/User';
import { UserService } from '@services/UserService';

describe('UserService Test', () => {
  let userService: UserService;
  let user: User = new User();
  Object.assign(user, {
    username: 'Test' + Date.now(),
    password: 'pwd' + Date.now(),
  });

  beforeAll(async () => {
    await connectDb();
    userService = new UserService();
  });

  test('Should exist', () => {
    expect(userService).toBeDefined();
  });

  test('getAll: should return valid response', async () => {
    expect(userService.getAll).toBeDefined();
    const resp = await userService.getAll();
    expect(resp).toBeInstanceOf(Array);
    resp.forEach((el) => {
      expect(el).toBeInstanceOf(User);
      expect(el.id).toBeDefined();
    });
  });

  test('save: should save a user', async () => {
    expect(userService.getById).toBeDefined();
    user = await userService.save(user);
    expect(user).toBeInstanceOf(User);
    expect(user.id).toBeDefined();
  });

  test('getById: should return valid response for valid input', async () => {
    expect(userService.getById).toBeDefined();
    const resp = await userService.getById(user.id);
    expect(resp).toBeInstanceOf(User);
    expect(resp.id).toBeDefined();
    expect(resp.username).toBeDefined();
    expect(resp.roles).toBeUndefined();
    expect(resp.password).toBeUndefined();
  });

  test('getByUsername: should return valid response for valid input', async () => {
    expect(userService.getByUsername).toBeDefined();
    const resp = await userService.getByUsername(user.username);
    expect(resp).toBeInstanceOf(User);
    expect(resp.id).toBeDefined();
    expect(resp.username).toBeDefined();
    expect(resp.roles).toBeUndefined();
    expect(resp.password).toBeUndefined();
  });

  test('getLogin: should return valid response for valid input', async () => {
    expect(userService.getLogin).toBeDefined();
    const resp = await userService.getLogin(user.username);
    expect(resp).toBeInstanceOf(User);
    expect(resp.id).toBeDefined();
    expect(resp.username).toBeDefined();
    expect(resp.password).toBeDefined();
    expect(resp.roles).toBeDefined();
  });

  test('remove: should return valid response for valid input', async () => {
    expect(userService.remove).toBeDefined();
    await userService.remove(user);
  });
});
