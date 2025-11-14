import { Notes, NotesData } from '../data/notes';


export class NotesController {
  constructor(private readonly notesData: NotesData) {}

  async createUserNotes(username: string, notes: string): Promise<Notes> {
    const existingNotes = await this.notesData.findByUsername(username);
    return this.notesData.create(username, notes);
  }

  async getUserNotes(username: string): Promise<string | null> {
    const notes = await this.notesData.findByUsername(username);
    if (!notes) {
      throw new Error('Notes not found');
    }
    return notes.notes || null;
  }
}
