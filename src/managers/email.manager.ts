import { emailAdapter } from '../adapters/email.adapter'

export const emailManager = {
	async sendEmailConfirmationMessage(userEmail: string) {
		// Send an email
		await emailAdapter.sendEmail(
			userEmail,
			'Тема письма',
			'Текст письма',
			'<p>Текст письма</p>',
		)
	},
}
