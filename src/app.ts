import express from 'express'
import RoutesNames from './config/routesNames'
import { db } from './db/db'
import getBlogsRouter from './routes/blogs.routes'
import getPostsRouter from './routes/posts.routes'
import getTestRouter from './routes/test.routes'

export const app = express()
app.use(express.json())

app.use(RoutesNames.blogs.root, getBlogsRouter(db))
app.use(RoutesNames.posts.root, getPostsRouter(db))
app.use(RoutesNames.testing.root, getTestRouter(db))
