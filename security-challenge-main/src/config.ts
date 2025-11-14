import { config as dotenvConfig } from 'dotenv';

const env = process.env.NODE_ENV ?? 'production';
dotenvConfig({ path: `.env.${env}` });

const vars = [
  'SERVICE_PORT',
  'REDIS_URL',
];

const importEnv = process.env;
vars.forEach((key) => {
  if (!importEnv[key]) {
    console.error(`Missing env value for ${key}`);
  }
});

export const config = {
  servicePort: importEnv.SERVICE_PORT,
  redisUrl: importEnv.REDIS_URL,
};
