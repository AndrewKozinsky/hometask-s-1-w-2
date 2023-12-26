import request from 'supertest'
import { app } from '../../src/app'
import RouteNames from '../../src/config/routeNames'
import { CreateBlogDtoModel } from '../../src/models/blogs.model'
import { CreatePostDtoModel } from '../../src/models/posts.model'
import { authorizationValue } from './blogs.api.test'

export async function addBlogRequest(blogDto: Partial<CreateBlogDtoModel> = {}) {
	return request(app)
		.post(RouteNames.blogs)
		.send(createDtoAddBlog(blogDto))
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json')
		.set('authorization', authorizationValue)
}

export function createDtoAddBlog(newBlogObj: Partial<CreateBlogDtoModel> = {}): CreateBlogDtoModel {
	return Object.assign(
		{
			name: 'my name',
			description: 'my description',
			websiteUrl:
				'https://9DKoTEgTwRIyvI8-tVDUU2STaq3OG.e0d6f1EB3XsujFbOW53q5woGXMrAc5zXUnQxWvxsTS6a3zLYZdUWDt-BnXLEs1',
		},
		{ ...newBlogObj },
	)
}

export async function addPostRequest(blogId: string, postDto: Partial<CreatePostDtoModel> = {}) {
	return request(app)
		.post(RouteNames.posts)
		.send(createDtoAddPost(blogId, postDto))
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json')
		.set('authorization', authorizationValue)
}

export function createDtoAddPost(
	blogId: string,
	newPostObj: Partial<CreatePostDtoModel> = {},
): CreatePostDtoModel {
	return Object.assign(
		{
			title: 'title',
			shortDescription: 'shortDescription',
			content: 'content',
			blogId,
		},
		newPostObj,
	)
}
