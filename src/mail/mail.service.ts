import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { User } from 'src/schemas/user.schema'

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmationMail(user: User, token: String) {
    const link = `${process.env.CLIENT_DOMAIN}/auth/confirm?token=${token}`

    await this.mailerService.sendMail({
      to: user.email,
      template: 'email-confirmation',
      subject: 'Підтвердження поштової скриньки',
      text: 'Перейдіть за посиланням щоб підтвердити електронну скриньку',
      context: {
        name: user.name,
        link,
      },
    })
  }
}
