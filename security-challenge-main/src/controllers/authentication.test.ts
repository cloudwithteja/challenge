import { describe, expect, it, vi } from 'vitest';
import { hash, verify } from '@node-rs/argon2';
import { when } from 'vitest-when';

import { AuthenticationController } from './authentication';
import { UserError } from '../authentication/user';

describe(AuthenticationController, () => {
  describe('createUser', () => {
    it('does not save an invalid user', async () => {
      const userData = spyUserData();

      const controller = new AuthenticationController(userData);
      const result = await controller.createUser('invalid name', 'password');

      expect(userData.create).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.errors).not.toHaveLength(0);
    });

    it('hashes the user password', async () => {
      const userData = spyUserData();
      when(userData.create)
        .calledWith('newuser', expect.any(String))
        .thenDo(async (username, password) => ({ username, password }));

      const controller = new AuthenticationController(userData);
      const { success, user } = await controller.createUser('newuser', 'password');

      expect(success).toBe(true);
      expect(await verify(user!.password, 'password')).toBe(true);
    });

    it('prevents duplicate username', async () => {
      const userData = spyUserData();
      when(userData.findByUsername)
        .calledWith('existinguser')
        .thenResolve({ username: 'existinguser', password: 'password' });

      const controller = new AuthenticationController(userData);
      const { success, errors } = await controller.createUser('existinguser', 'password');

      expect(success).toBe(false);
      expect(errors).toEqual([{ code: UserError.USERNAME_ALREADY_EXISTS, message: 'Username already exists' }]);
    });
  });

  describe('isPasswordValid', () => {
    it('is true if the password is valid', async () => {
      const userData = spyUserData();
      const existingUser = { username: 'theuser', password: await hash('the pass') };
      when(userData.findByUsername).calledWith('theuser').thenResolve(existingUser);

      const controller = new AuthenticationController(userData);
      const isValid = await controller.isPasswordValid('theuser', 'the pass');

      expect(isValid).toBe(true);
    });

    it('is false if the password is not valid', async () => {
      const userData = spyUserData();
      const existingUser = { username: 'theuser', password: await hash('the pass') };
      when(userData.findByUsername).calledWith('theuser').thenResolve(existingUser);

      const controller = new AuthenticationController(userData);
      const isValid = await controller.isPasswordValid('theuser', 'bad pass');

      expect(isValid).toBe(false);
    });

    it('is false if the user is not found', async () => {
      const userData = spyUserData();
      when(userData.findByUsername).calledWith('theuser').thenResolve(null);

      const controller = new AuthenticationController(userData);
      const isValid = await controller.isPasswordValid('theuser', 'the pass');

      expect(isValid).toBe(false);
    });

    it('is false if the input is invalid', async () => {
      const controller = new AuthenticationController(spyUserData());
      const isValid = await controller.isPasswordValid('', '');

      expect(isValid).toBe(false);
    });
  });
});

function spyUserData() {
  return {
    create: vi.fn(),
    findByUsername: vi.fn(),
  };
}
