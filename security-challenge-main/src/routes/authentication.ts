import express from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticationController } from '../controllers/authentication';
import { getRedisClient } from '../data/redis/redis';
import { handleUnknownError } from '../utils/error';
import { RedisUserData } from '../data/redis/user';

const router: express.Router = express.Router();

async function getAuthenticationController() {
  const client = await getRedisClient();
  return new AuthenticationController(new RedisUserData(client));
}

router.post('/create-user', function (req: express.Request, res: express.Response) {
  getAuthenticationController().then((controller: AuthenticationController) => {
    controller
      .createUser(req.body.username, req.body.password)
      .then((result) => {
        if (result.success) {
          res.json(result.user!).end();
        } else {
          res.status(422).json({ errors: result.errors }).end();
        }
      })
      .catch(handleUnknownError(res));
  });
});

router.post('/login', function (req: express.Request, res: express.Response) {
  getAuthenticationController().then((controller: AuthenticationController) => {
    controller
      .isPasswordValid(req.body.username, req.body.password)
      .then((isValid) => {
        if (isValid) {
          const token = jwt.sign({ username: req.body.username }, 'JWT');
          res.json({ token }).end();
        } else {
          res.status(401).json({ message: `Credentials are invalid` }).end();
        }
      })
      .catch(handleUnknownError(res));
  });
});

export const authenticationRouter = router;
