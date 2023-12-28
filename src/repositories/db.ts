import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'

dotenv.config()

export const client = new MongoClient(process.env.MONGO_URL)

export async function runDb() {
	try {
		await client.connect()
		// Проверка, что соединение произошло успешно сделав запрос на несуществующую БД products.
		await client.db('products').command({ ping: 1 })
		console.log('Connected to DB 🦁')
	} catch {
		console.log('Cannot connect to DB 🐲')
		await client.close()
	}
}

export const db = client.db(process.env.MONGO_DB_NAME)
