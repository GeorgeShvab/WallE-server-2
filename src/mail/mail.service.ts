import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import mongoose from 'mongoose'
import { Document } from 'src/schemas/document.schema'
import { User } from 'src/schemas/user.schema'

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmationMail(user: User, token: String) {
    const link = `${process.env.CLIENT_ADDRESS}/signup/confirmation?token=${token}`

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
    const link = `${process.env.CLIENT_ADDRESS}/password-reset?token=${token}`

    await this.mailerService.sendMail({
      to: email,
      template: 'password-reset',
      subject: 'Відновлення пароля',
      text: 'Перейдіть за посиланням, щоб продовжити відновлення пароля',
      context: {
        server_address: process.env.SERVER_ADDRESS,
        title: 'Відновлення пароля',
        link,
      },
    })
  }

  async sendCollaborationInvite(
    emails: string[],
    user: { name: string },
    document: Document & { _id: mongoose.Types.ObjectId }
  ) {
    const link = `${process.env.CLIENT_ADDRESS}/documents/${document._id}`

    emails.forEach(async (item) => {
      await this.mailerService.sendMail({
        to: item,
        template: 'invite',
        subject: 'Запрошення',
        text: `Ви отримали запрошення до редагування документа ${document.title}`,
        context: {
          server_address: process.env.SERVER_ADDRESS,
          title: 'Запрошення',
          name: user.name,
          document: document.title,
          link,
        },
      })
    })
  }
}
