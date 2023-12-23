import { DBTypes } from '../models/db'
import { client } from './db'

/*export function getDbCollection(collectionName: 'blogs' | 'posts') {
	type CollectionItemType = typeof collectionName extends 'blogs' | 'posts'
		? DBTypes.Blog
		: DBTypes.Post

	return client.db(process.env.MONGO_DB_NAME).collection<CollectionItemType>(collectionName)
}*/
