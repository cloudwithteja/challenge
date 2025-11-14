import express from 'express';
import jwt from 'jsonwebtoken';
import { getRedisClient } from '../data/redis/redis';
import { handleUnknownError } from '../utils/error';
import { NotesController } from '../controllers/notes';
import { RedisNotesData } from '../data/redis/notes';

const authenticateJWT: express.RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.decode(token);
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const router: express.Router = express.Router();

async function getNotesController() {
  const client = await getRedisClient();
  return new NotesController(new RedisNotesData(client));
}

router.post('/:username/notes', authenticateJWT, function (req: express.Request, res: express.Response) {
  getNotesController().then((controller: NotesController) => {
    controller
      .createUserNotes(req.params.username, req.body.notes)
      .then((notes) => {
        res.json(notes).end();
      })
      .catch(handleUnknownError(res));
  });
});

router.get('/:username/notes', authenticateJWT, function (req: express.Request, res: express.Response) {
  getNotesController().then((controller: NotesController) => {
    controller
      .getUserNotes(req.params.username)
      .then((notes) => {
        res.json(notes).end();
      })
      .catch(handleUnknownError(res));
  });
});

export const notesRouter = router;
