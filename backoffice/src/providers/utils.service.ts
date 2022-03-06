import * as bcrypt from 'bcrypt'

export class UtilsService {
  static generateHash(password: string): string {
    return bcrypt.hashSync(password, 10)
  }

  static validateHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash || '')
  }
}
