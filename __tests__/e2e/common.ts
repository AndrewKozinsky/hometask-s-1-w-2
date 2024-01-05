import request from 'supertest'
import { app } from '../../src/app'
import RouteNames from '../../src/config/routeNames'
import {
	CreateBlogDtoModel,
	CreateBlogPostDtoModel,
} from '../../src/models/input/blogs.input.model'
import { CreatePostDtoModel } from '../../src/models/input/posts.input.model'
import { authorizationValue } from './blogs.api.test'

export async function addBlogRequest(blogDto: Partial<CreateBlogDtoModel> = {}) {
	return request(app)
		.post(RouteNames.blogs)
		.send(createDtoAddBlog(blogDto))
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json')
		.set('authorization', authorizationValue)
}

export async function addBlogPostRequest(
	blogId: string,
	postDto: Partial<CreateBlogPostDtoModel> = {},
) {
	const addBlogPostDto = createDtoAddBlogPost(postDto)

	return await request(app)
		.post(RouteNames.blogPosts(blogId))
		.send(addBlogPostDto)
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

export function createDtoAddBlogPost(
	newPostObj: Partial<CreateBlogPostDtoModel> = {},
): CreateBlogPostDtoModel {
	return Object.assign(
		{
			title: 'title',
			shortDescription: 'shortDescription',
			content: 'content',
		},
		newPostObj,
	)
}

export function checkPostObj(postObj: any) {
	expect(postObj._id).toBe(undefined)
	expect(typeof postObj.id).toBe('string')
	expect(typeof postObj.title).toBe('string')
	expect(typeof postObj.shortDescription).toBe('string')
	expect(typeof postObj.content).toBe('string')
	expect(typeof postObj.blogId).toBe('string')
	expect(typeof postObj.blogName).toBe('string')
	expect(postObj.createdAt).toMatch(
		/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
	)
}
