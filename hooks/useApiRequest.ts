import { useCallback } from 'react'
import { AxiosInstance } from 'axios'
import { toast } from 'react-toastify'

import { http } from '~/core/axios'

import { ApiEndpoints } from '~/constants/apiEndpoints'

const endpoints = Object.keys(ApiEndpoints).reduce((endpoints: any, key: any) => {
    // @ts-ignore
    endpoints[key] = ApiEndpoints[key as any]

    return endpoints
}, {})

type TRequestCallback = (http: AxiosInstance, endpoints: typeof ApiEndpoints) => Promise<void>
type TFactoryCallback = (...args: any[]) => TRequestCallback

export const useApiRequest = <T extends TFactoryCallback>(factory: T) => {
    return useCallback(
        async (...args: Parameters<typeof factory>) => {
            try {
                const callback = factory(...args)
                await callback(http, endpoints)
            } catch (error: any) {
                if (error.response !== undefined && error.response.data.message !== undefined) {
                    toast.error(error.response.data.message)
                    return
                }
                toast.error('Ошибка!')
            }
        },
        [factory],
    )
}
