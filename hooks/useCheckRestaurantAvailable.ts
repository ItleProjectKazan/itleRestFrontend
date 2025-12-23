import { useCallback } from 'react'

import { useStore } from '~/hooks/useStore'

type TCallback = (...args: any[]) => void

export const useCheckRestaurantAvailable = <T extends TCallback>(callback: T) => {
    const { orderParams, restaurantSelectModal } = useStore()

    return useCallback((...args: Parameters<typeof callback>) => {
        if (orderParams.restaurant === null) {
            restaurantSelectModal.open('')

            return
        }

        callback(...args)
    }, [callback,orderParams, restaurantSelectModal])
}
