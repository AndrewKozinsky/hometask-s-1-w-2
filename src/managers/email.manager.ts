import { emailAdapter } from '../adapters/email.adapter'

export const emailManager = {
	async sendEmailConfirmationMessage(userEmail: string, confirmationCode: string) {
		// Send an email
		await emailAdapter.sendEmail(
			userEmail,
			'Registration',
			'Registration at out web-site',
			`<p><a href="https://localhost:3000?code=${confirmationCode}">Registration at out web-site</a></p>`,
		)
	},
}
