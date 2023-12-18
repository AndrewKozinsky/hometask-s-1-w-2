import { app } from './app'
import { config } from './config/config'

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.listen(config.port, () => {
	console.log(`App started in ${config.port} port 🔥`)
})
