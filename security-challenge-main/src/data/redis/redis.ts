import { createClient } from 'redis';
import { config } from '../../config';

let client: ReturnType<typeof createClient>;
export async function getRedisClient() {
  client ??= await createRedisClient();
  return client;
}

async function createRedisClient() {
  const connectionOptions = { url: config.redisUrl };
  const client = createClient(connectionOptions);
  client.on('error', (err) => console.log('Redis Client Error', err));
  await client.connect();
  return client;
}
