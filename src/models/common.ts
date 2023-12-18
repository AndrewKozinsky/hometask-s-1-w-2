import { Request } from 'express'

export type ReqWithBody<T> = Request<{}, {}, T>
export type ReqWithQuery<T> = Request<{}, {}, {}, T>
export type ReqWithParams<T> = Request<T>
export type ReqWithParamsAndBody<T, B> = Request<T, {}, B>

export type ErrorMessage = {
	message: string
	field: string
}

export type ErrorResponse = {
	errorsMessages: ErrorMessage[]
}
