import { UnknownDataError, User, UserData } from '../user';
import { createClient } from 'redis';

export class RedisUserData implements UserData {
  constructor(private readonly client: ReturnType<typeof createClient>) {}

  async create(username: string, password: string): Promise<User> {
    try {
      await this.client.hSet(`user:${username}`, { username, password });
    } catch (_e) {
      throw new UnknownDataError();
    }

    return { username, password };
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const user = await this.client.hGetAll(`user:${username}`);
      if (!user || Object.keys(user).length === 0) {
        return null;
      }
      return { ...user } as unknown as User;
    } catch (_e) {
      throw new UnknownDataError();
    }
  }
}
