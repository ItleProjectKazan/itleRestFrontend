import { useEffect } from 'react'
import Router, { useRouter } from 'next/router'

import { usePrevious, useStore } from '~/hooks'

export const useRestaurantUpdate = () => {
    const { localities, orderParams } = useStore()
    const { query } = useRouter()

    const prevLocalityId = usePrevious(orderParams.localityId)
    const prevRestaurantId = usePrevious(orderParams.restaurantId)

    useEffect(() => {
        if (prevLocalityId === null) {
            ///return
        }

        if (prevLocalityId === orderParams.localityId) {
            return
        }

        const locality = localities.find(locality => locality.id === orderParams.localityId)

        if (locality !== undefined && prevLocalityId !== locality?.id) {
            let query_string = ''
            if (typeof query.localitySlug !== 'undefined') {
                delete query.localitySlug
            }
            if (Object.keys(query).length) {
                let url_params = new URLSearchParams(query as any)
                query_string = url_params.toString()
            }

            let redirect_to = '/' + locality.slug
            if (query_string.length) {
                redirect_to += '?' + query_string
            }

            Router.push(redirect_to)
        }

    }, [localities, prevLocalityId, prevRestaurantId, orderParams.localityId, orderParams.restaurantId, query])
}
