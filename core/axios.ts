import axios from 'axios'

import { ApiErrors } from '~/constants/apiErrors'

export const API_URL = process.env.NEXT_PUBLIC_API_URL
export const NEXT_TYPE = process.env.NEXT_TYPE

export const http = axios.create({
    baseURL: `${ API_URL }/${ NEXT_TYPE }`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

// refreshing of expired CSRF token
http.interceptors.response.use(response => response, async error => {
    if (
        error.response !== undefined &&
        error.response.status === 400
        && error.response.data.code === ApiErrors.INVALID_CSRF_TOKEN
    ) {
        await http.get('/csrf-cookie', {
            baseURL: API_URL,
        })

        return http.request(error.config)
    }

    return Promise.reject(error)
})
