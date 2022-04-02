import * as bcrypt from 'bcrypt'
import * as util from 'util'
import * as crypto from 'crypto'

export class UtilsService {
  static generateHash(password: string): string {
    return bcrypt.hashSync(password, 10)
  }

  static validateHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash || '')
  }

  static generateVerificationCode(): number {
    return Math.floor(Math.random() * 90000) + 10000
  }

  static async generateToken(
    bytes: number,
    encoding: BufferEncoding,
  ): Promise<string> {
    return (await util.promisify(crypto.randomBytes)(bytes)).toString(encoding)
  }

  static comparePasswords(
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(oldPassword, newPassword)
  }
}
