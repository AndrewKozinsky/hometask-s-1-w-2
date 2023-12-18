import request from 'supertest'
import { app } from '../../src/app'
import RoutesNames from '../../src/config/routesNames'
// import consts from '../../src/common/constants'
// import RoutesNames from '../../src/common/routesNames'
// import VideoTypes from '../../src/routes/video/video.type'
// import { app } from '../../src/settings'

beforeEach(async () => {
	await request(app).delete(RoutesNames.testing.root + RoutesNames.testing.allData)
})

/*describe('Getting all videos', () => {
	it('should return an empty array of videos', async () => {
		await request(app).get(RoutesNames.videos).expect(200, [])
	})

	it('should return an array with 2 items after creating 2 videos', async () => {
		await addVideoRequest()
		await addVideoRequest()

		const getVideosRes = await request(app).get(RoutesNames.videos).expect(200)

		expect(getVideosRes.body.length).toBe(2)
	})
})*/

/*describe('Getting a video', () => {
	it("should return a 404 if video doesn't exists", async () => {
		await request(app).get(RoutesNames.video(999)).expect(404)
	})

	it('should return an existing video', async () => {
		const createdVideoRes = await addVideoRequest()
		const createdVideoId = createdVideoRes.body.id

		await request(app).get(RoutesNames.video(createdVideoId)).expect(200)
	})
})*/

/*describe('Creating a video', () => {
	it('create an video by wrong dto', async () => {
		await addVideoRequest({ title: '' }).expect(400)
	})

	it('should create a video by correct dto', async () => {
		const createdVideoRes = await addVideoRequest().expect(201)

		expect(createdVideoRes.body.title).toEqual(createDtoAddVideo().title)
		expect(createdVideoRes.body.author).toEqual(createDtoAddVideo().author)
		expect(createdVideoRes.body.availableResolutions).toEqual(
			createDtoAddVideo().availableResolutions,
		)

		// Check if there are 2 videos after adding another one
		await addVideoRequest().expect(201)
		const allVideosRes = await request(app).get(RoutesNames.videos)
		expect(allVideosRes.body.length).toBe(2)
	})
})*/

/*describe('Updating a video', () => {
	it('should not update a non existing video', async () => {
		await request(app).put(RoutesNames.video(999)).expect(404)
	})

	it('should not update a video by wrong dto', async () => {
		const createdVideoRes = await addVideoRequest()
		const createdVideoId = createdVideoRes.body.id

		await request(app).put(RoutesNames.video(createdVideoId)).expect(400)

		await request(app)
			.put(RoutesNames.video(createdVideoId))
			.send({})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(400)

		await request(app)
			.put(RoutesNames.video(createdVideoId))
			.send({ title: 'title', author: 'author', publicationDate: 4 })
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(400)
	})

	it('should update a video by correct dto', async () => {
		const createdVideoRes = await addVideoRequest().expect(201)
		const createdVideoId = createdVideoRes.body.id

		await request(app)
			.put(RoutesNames.video(createdVideoId))
			.send({ title: 'new title', author: 'new author', publicationDate: '123' })
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(204)
	})
})*/

/*describe('Deleting a video', () => {
	it('should not delete a non existing video', async () => {
		await request(app).delete(RoutesNames.video(999)).expect(404)
	})

	it('should delete a video', async () => {
		const createdVideoRes = await addVideoRequest().expect(201)
		const createdVideoId = createdVideoRes.body.id

		await request(app).delete(RoutesNames.video(createdVideoId)).expect(204)
	})
})*/

/*function addVideoRequest(videoObj: Partial<VideoTypes.CreateVideoDto> = {}) {
	return request(app)
		.post(RoutesNames.videos)
		.send(createDtoAddVideo(videoObj))
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json')
}*/

/*function createDtoAddVideo(
	videoObj: Partial<VideoTypes.CreateVideoDto> = {},
): VideoTypes.CreateVideoDto {
	return Object.assign(
		{
			title: 'video title',
			author: 'video author',
			availableResolutions: [],
		},
		{ ...videoObj },
	)
}*/
