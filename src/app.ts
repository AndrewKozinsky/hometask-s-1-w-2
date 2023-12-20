import express from 'express'
import RouteNames from './config/routeNames'
import { db } from './db/db'
import getBlogsRouter from './routes/blogs.routes'
import getPostsRouter from './routes/posts.routes'
import getTestRouter from './routes/test.routes'

export const app = express()
app.use(express.json())

app.use(RouteNames.blogs, getBlogsRouter(db))
app.use(RouteNames.posts, getPostsRouter(db))
app.use(RouteNames.testing, getTestRouter(db))
