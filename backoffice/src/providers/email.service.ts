import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'

@Injectable()
export class EmailService {
  private readonly transport

  private readonly from: string

  constructor(private readonly configService: ConfigService) {
    this.transport = nodemailer.createTransport({
      host: configService.get<string>('mailerSettings.smtp'),
      auth: {
        user: configService.get<string>('mailerSettings.username'),
        pass: configService.get<string>('mailerSettings.password'),
      },
    })

    this.from = configService.get<string>('mailerSettings.username')
  }

  public sendText(to: string, subject: string, what: string) {
    return this.send(to, subject, what)
  }

  private send(to: string, subject: string, text: string) {
    const options = {
      subject,
      to,
      from: this.from,
      text,
    }
    return this.transport.sendMail(options)
  }
}
