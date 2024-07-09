import fs from 'node:fs';

export class Csv {
  constructor(public file: string, public headers: string[]) {}

  async create() {
    await fs.promises.writeFile(this.file, this.headers.map(header => `"${header}"`).join(',') + '\n');
  }

  async append(row: (string | undefined)[]) {
    if (row.length !== this.headers.length) {
      throw new Error('Row length does not match headers length');
    }
    await fs.promises.appendFile(this.file, row.map(cell => `"${cell ?? ''}"`).join(',') + '\n');
  }
}
