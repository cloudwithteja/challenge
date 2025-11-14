import fs from 'fs';

export abstract class JsonFile<T> {
  abstract filename: string;

  protected readData(): T {
    try {
      const data = fs.readFileSync(this.filename) as unknown as string;
      return JSON.parse(data);
    } catch (_err: unknown) {
      return [] as T;
    }
  }

  protected writeData(data: T) {
    fs.writeFileSync(this.filename, JSON.stringify(data));
  }
}
