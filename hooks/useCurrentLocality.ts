import { useRouter } from 'next/router'

import { useStore } from '~/hooks'
import { useMemo } from 'react'

export const useCurrentLocality = () => {
    const { localities } = useStore()
    const router = useRouter()

    return useMemo(() => {
        const locality = router.query.localitySlug !== undefined ? localities.find(locality => (
            locality.slug === router.query.localitySlug
        )) : localities.find(locality => {
            return locality.is_default
        })

        return locality ?? null
    }, [localities, router.query.localitySlug])
}
