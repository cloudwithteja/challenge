import { JsonFile } from './json-file';
import { UserData } from '../user';

interface UserRecord {
  username: string;
  password: string;
}

export class FileUserData extends JsonFile<UserRecord[]> implements UserData {
  filename = 'users.json';

  async create(username: string, password: string) {
    const users = this.readData();
    const newUser = { username, password };
    users.push(newUser);
    this.writeData(users);

    return newUser;
  }

  async findByUsername(username: string) {
    const users = this.readData();
    const user = users.find((user) => user.username === username);
    return user || null;
  }
}
