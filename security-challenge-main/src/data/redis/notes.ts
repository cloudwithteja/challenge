import { UnknownDataError, Notes, NotesData } from '../notes';
import { createClient } from 'redis';

export class RedisNotesData implements NotesData {
  constructor(private readonly client: ReturnType<typeof createClient>) {}

  async create(username: string, notes: string): Promise<Notes> {
    try {
      await this.client.hSet(`notes:${username}`, { username, notes });
    } catch (_e) {
      throw new UnknownDataError();
    }

    return { username, notes };
  }

  async findByUsername(username: string): Promise<Notes | null> {
    try {
      const notes = await this.client.hGetAll(`notes:${username}`);
      if (!notes || Object.keys(notes).length === 0) {
        return null;
      }
      return { ...notes } as unknown as Notes;
    } catch (_e) {
      throw new UnknownDataError();
    }
  }
}
