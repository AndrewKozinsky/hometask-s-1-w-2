import { app } from './app'
import { config } from './config/config'
import { runDb } from './repositories/db'

async function startApp() {
	await runDb()
	app.listen(config.port, () => {
		console.log(`App started in ${config.port} port 🔥`)
	})
}

startApp()
