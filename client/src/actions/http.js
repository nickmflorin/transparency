import { HttpTypes } from './types'

export function HttpRequest(requesting) {
    return { type: HttpTypes.HTTP_REQUEST, requesting };
}