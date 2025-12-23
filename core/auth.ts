import { parse } from 'cookie'

import { API_URL, http } from '~/core/axios'

let headers: Record<string, string> = {}
let authToken: string | undefined = undefined

if (typeof document !== 'undefined') {
    authToken = parse(document.cookie).token
}

http.interceptors.request.use((config) => {
    // @ts-ignore
    const isApiRequest = config.baseURL?.startsWith(API_URL) && config.url?.startsWith('/')

    if (!isApiRequest || !config.withCredentials) {
        return config
    }

    // headers from the config have higher priority
    // @ts-ignore
    config.headers = {
        ...headers,
        ...(config.headers ?? {}),
    }

    if (authToken !== undefined) {
        config.headers['Authorization'] = `Bearer ${authToken}`
    }

    return config
})

export const setAuthToken = (token: string | undefined) => {
    authToken = token
}

export const setRequestHeaders = (requestHeaders: Record<string, string>) => {
    headers = getRequestHeaders(requestHeaders)
}

const getRequestHeaders = (requestHeaders: Record<string, string>) => {
    const headers = ['user-agent', 'x-real-ip'].reduce<any>((headers, headerName) => {
        const headerValue = requestHeaders[headerName]

        if (headerValue !== undefined) {
            headers[headerName] = headerValue
        }

        return headers
    }, {})

    // build the referer header because browsers don't send "Referer" header in the first request
    headers['referer'] = `${requestHeaders['x-forwarded-proto']}://${requestHeaders['x-forwarded-host']}`

    return headers
}
