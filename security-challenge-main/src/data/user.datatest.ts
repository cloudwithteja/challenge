import { describe, expect, test } from 'vitest';

import { RedisUserData } from './redis/user';
import { getRedisClient } from './redis/redis';
import { FileUserData } from './file/user';

describe('UserData', async () => {
  const redisData = new RedisUserData(await getRedisClient());
  const fileData = new FileUserData();

  describe.each([
    { name: 'RedisUserData', data: redisData },
    { name: 'FileUserData', data: fileData },
  ])('$name', async ({ data }) => {
    test('if a user is created we should be able to look them up by username', async () => {
      await data.create('test', 'password');
      const user = await data.findByUsername('test');

      expect(user).toEqual({ username: 'test', password: 'password' });
    });

    test('if a user is not found it should return null', async () => {
      const user = await data.findByUsername('notfoundusername');

      expect(user).toEqual(null);
    });
  });
});
