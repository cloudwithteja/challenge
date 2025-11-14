export interface Notes {
  username: string;
  notes: string;
}

export interface NotesData {
  create(username: string, notes: string): Promise<Notes>;
  findByUsername(username: string): Promise<Notes | null>;
}

export class UnknownDataError extends Error {
  message = 'Unknown data error';
}
