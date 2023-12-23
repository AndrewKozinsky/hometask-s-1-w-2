import express, { Request, Response } from 'express'
import RouteNames from './config/routeNames'
import getBlogsRouter from './routes/blogs.routes'
import getPostsRouter from './routes/posts.routes'
import getTestRouter from './routes/test.routes'

export const app = express()
app.use(express.json())

app.use(RouteNames.blogs, getBlogsRouter())
app.use(RouteNames.posts, getPostsRouter())
app.use(RouteNames.testing, getTestRouter())

/*app.use((err: Error, req: Request, res: Response) => {
	console.log(err.message)
	res.status(500).send(err.message)
})*/
