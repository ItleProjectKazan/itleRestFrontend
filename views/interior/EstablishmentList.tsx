import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useQuery } from 'react-query'
import { QUERY_KEYS } from '~/views/home/constants'
import { getPagePreview } from '~/services/queries'
import { Loader } from '~/components'
import { TPagePreview, TEstablishment } from '~/types/pages/page'

import RestorauntShedule from '~/components/RestorauntShedule'

const EstablishmentList = () => {
    const [establishment, setEstablishment] = useState<TEstablishment[]>([])
    const [loading, setLoading] = useState(true)
    const limit = 4
    const offset = 0
    const establishmentResponse = useQuery<TPagePreview<TEstablishment[]>, TEstablishment[]>(
        QUERY_KEYS.PAGES_PREVIEW('establishment', limit, offset),
        () => getPagePreview<TPagePreview<TEstablishment[]>, TEstablishment[]>('establishment', limit, offset),
        {
            refetchOnWindowFocus: false,
        },
    ).data

    useEffect(() => {
        if (establishmentResponse?.content_pages) {
            setEstablishment(establishmentResponse.content_pages)
        }
        setLoading(false)
    }, [establishmentResponse])

    if (loading) {
        return (
            <div className='main-banner__slide loading'>
                <Loader />
            </div>
        )
    }
    return (
        <div className='interior-page__restaurants d-flex flex-wrap justify-between'>
            {establishment.map(({ id, image, main_title, address, restaurant_id }) => {
                return (
                    <div key={id} className='interior-page__restaurant d-flex flex-wrap'>
                        <Link
                            key={id}
                            href={`/interior/${id}`}
                            className='restaurant d-flex'
                            style={{
                                backgroundImage: `url(${image})`,
                            }}
                        >
                            <div className='restaurant__inner d-flex items-end'>
                                <svg
                                    className='restaurant__icon'
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='51'
                                    height='100'
                                    viewBox='0 0 51 100'
                                    fill='none'
                                >
                                    <path
                                        d='M27.3649 22.9536H27.3515C13.8295 9.8244 0.294102 0.210094 0 0V99.0544L0.00668414 99.0577C0.00668414 99.0577 13.6791 89.3734 27.3649 76.1008C41.0373 62.8148 51 49.5289 51 49.5289C51 49.5289 41.0373 36.2429 27.3649 22.9569V22.9536Z'
                                        fill='#C91100'
                                    />
                                </svg>
                                <div className='restaurant__info d-flex flex-column'>
                                    <span className='restaurant__info-address'>{address}</span>

                                    <h3 className='restaurant__info-title'>
                                        <span>стейк–кафе</span>
                                        {main_title}
                                    </h3>
                                </div>
                            </div>
                        </Link>
                        <div className='interior-page__map'>
                            <RestorauntShedule
                                key={id}
                                latitudePlus={0.02}
                                longitudePlus={0.025}
                                restaurantId={Number(restaurant_id)}
                                withBooking
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default EstablishmentList
