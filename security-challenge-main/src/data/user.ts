export interface User {
  username: string;
  password: string;
}

export interface UserData {
  create(username: string, password: string): Promise<User>;
  findByUsername(username: string): Promise<User | null>;
}

export class UnknownDataError extends Error {
  message = 'Unknown data error';
}
