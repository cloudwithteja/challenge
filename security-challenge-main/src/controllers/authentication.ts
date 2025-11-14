import { hash, verify } from '@node-rs/argon2';

import { User, UserData } from '../data/user';
import { UserError, validateAccount } from '../authentication/user';

const hashOptions = {
  memoryCost: 1024,
  timeCost: 1,
  parallelism: 1,
};

type CreateUserResult =
  | {
      success: true;
      errors: unknown[];
      user: User;
    }
  | {
      success: false;
      errors: unknown[];
      user: null;
    };

export class AuthenticationController {
  constructor(private readonly userData: UserData) {}

  async createUser(username: string, password: string): Promise<CreateUserResult> {
    const validation = validateAccount(username, password);
    if (validation.errors.length > 0) {
      return { success: false, errors: validation.errors, user: null };
    }

    const existingUser = await this.userData.findByUsername(username);
    if (existingUser) {
      const error = { code: UserError.USERNAME_ALREADY_EXISTS, message: 'Username already exists' };
      return { success: false, errors: [error], user: null };
    }

    const hashed = await hash(password, hashOptions);
    const user = await this.userData.create(username, hashed);
    return { success: true, errors: [], user };
  }

  async isPasswordValid(username: string, password: string) {
    if (!username || !username.trim() || !password || !password.trim()) {
      return false;
    }

    const user = await this.userData.findByUsername(username);
    if (!user) {
      return false;
    }

    return verify(user.password, password, hashOptions);
  }
}
