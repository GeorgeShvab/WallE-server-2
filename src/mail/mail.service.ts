import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { User } from 'src/schemas/user.schema'

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmationMail(user: User, token: String) {
    const link = `${process.env.CLIENT_ADDRESS}/auth/confirm?token=${token}`

    await this.mailerService.sendMail({
      to: user.email,
      template: 'email-confirmation',
      subject: 'Підтвердження поштової скриньки',
      text: 'Перейдіть за посиланням, щоб підтвердити електронну скриньку',
      context: {
        server_address: process.env.SERVER_ADDRESS,
        name: user.name,
        title: 'Підтвердження поштової скриньки',
        link,
      },
    })
  }

  async sendPasswordResetMail(email: string, token: String) {
    const link = `${process.env.CLIENT_ADDRESS}/user/reset-password?token=${token}`

    await this.mailerService.sendMail({
      to: email,
      template: 'password-reset',
      subject: 'Скидання пароля',
      text: 'Перейдіть за посиланням, щоб продовжити скидання пароля',
      context: {
        server_address: process.env.SERVER_ADDRESS,
        title: 'Скидання пароля',
        link,
      },
    })
  }
}
