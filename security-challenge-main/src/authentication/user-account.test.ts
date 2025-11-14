import { describe, expect, it } from 'vitest';

import {
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  UserError,
  validateAccount,
} from './user';

describe(validateAccount, () => {
  describe('username required', () => {
    it('adds username required error when null', async () => {
      const { errors } = validateAccount(null as never, 'password');
      expect(errors).toEqual([{ code: UserError.USERNAME_REQUIRED, message: 'Username is required' }]);
    });

    it('adds username required error when undefined', async () => {
      const { errors } = validateAccount(undefined as never, 'password');
      expect(errors).toEqual([{ code: UserError.USERNAME_REQUIRED, message: 'Username is required' }]);
    });

    it('adds username required error when blank', async () => {
      const { errors } = validateAccount('', 'password');
      expect(errors).toEqual([{ code: UserError.USERNAME_REQUIRED, message: 'Username is required' }]);
    });

    it('adds username required error when string is all whitespace', async () => {
      const { errors } = validateAccount('   ', 'password');
      expect(errors).toEqual([{ code: UserError.USERNAME_REQUIRED, message: 'Username is required' }]);
    });
  });

  describe('username validation', () => {
    it('rejects spaces', async () => {
      const { errors } = validateAccount('k l', 'password');
      expect(errors).toEqual([
        { code: UserError.USERNAME_INVALID_CHARACTERS, message: `Username contains invalid characters` },
      ]);
    });

    it('rejects usernames above max length', async () => {
      const { errors } = validateAccount(stringOfLength(MAX_USERNAME_LENGTH + 1), 'password');
      expect(errors).toEqual([
        { code: UserError.USERNAME_TOO_LONG, message: `Username is too long. Max length is ${MAX_USERNAME_LENGTH}` },
      ]);
    });

    it('allows usernames at max length', async () => {
      const { errors } = validateAccount(stringOfLength(MAX_USERNAME_LENGTH), 'password');
      expect(errors).toEqual([]);
    });
  });

  describe('password required', () => {
    it('adds password required error when null', async () => {
      const { errors } = validateAccount('user', null as never);
      expect(errors).toEqual([{ code: UserError.PASSWORD_REQUIRED, message: 'Password is required' }]);
    });

    it('adds password required error when undefined', async () => {
      const { errors } = validateAccount('user', undefined as never);
      expect(errors).toEqual([{ code: UserError.PASSWORD_REQUIRED, message: 'Password is required' }]);
    });

    it('adds password required error when blank', async () => {
      const { errors } = validateAccount('user', '');
      expect(errors).toEqual([{ code: UserError.PASSWORD_REQUIRED, message: 'Password is required' }]);
    });

    it('adds password required error when string is all whitespace', async () => {
      const { errors } = validateAccount('user', '   ');
      expect(errors).toEqual([{ code: UserError.PASSWORD_REQUIRED, message: 'Password is required' }]);
    });
  });

  describe('password validation', () => {
    it('rejects passwords above max length', async () => {
      const { errors } = validateAccount('user', stringOfLength(MAX_PASSWORD_LENGTH + 1));
      expect(errors).toEqual([
        { code: UserError.PASSWORD_TOO_LONG, message: `Password is too long. Max length is ${MAX_PASSWORD_LENGTH}` },
      ]);
    });

    it('allows passwords at max length', async () => {
      const { errors } = validateAccount('user', stringOfLength(MAX_PASSWORD_LENGTH));
      expect(errors).toEqual([]);
    });

    it('rejects passwords below min length', async () => {
      const { errors } = validateAccount('user', stringOfLength(MIN_PASSWORD_LENGTH - 1));
      expect(errors).toEqual([
        { code: UserError.PASSWORD_TOO_SHORT, message: `Password is too short. Min length is ${MIN_PASSWORD_LENGTH}` },
      ]);
    });

    it('allows passwords at min length', async () => {
      const { errors } = validateAccount('user', stringOfLength(MIN_PASSWORD_LENGTH));
      expect(errors).toEqual([]);
    });
  });
});

function stringOfLength(length: number) {
  // Fill a string with 'A' characters
  return new Array(length + 1).join('A');
}
