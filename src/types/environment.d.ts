export {}

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			AUTH_LOGIN: string
			AUTH_PASSWORD: string
			MONGO_URL: string
			MONGO_DB_NAME: string
		}
	}
}
