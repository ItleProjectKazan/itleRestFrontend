import { useRouter } from 'next/router'

import { useStore } from '~/hooks'
import { useMemo } from 'react'

export const useCurrentRestaurant = () => {
    const { localities, orderParams } = useStore()
    const router = useRouter()

    return useMemo(() => {
        if (orderParams.restaurant !== null) {
            return orderParams.restaurant
        }

        const locality = router.query.localitySlug !== undefined ? localities.find(locality => (
            locality.slug === router.query.localitySlug
        )) : localities.find(locality => {
            return locality.is_default
        })

        return locality?.restaurants.find(restaurant => {
            return restaurant.is_default
        }) ?? null
    }, [localities, orderParams.restaurant, router.query.localitySlug])
}
