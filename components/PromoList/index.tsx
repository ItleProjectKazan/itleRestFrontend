import { useState, useEffect, memo } from 'react'
import { useQuery } from 'react-query'
import { Loader } from '~/components'
import { getPromos } from '~/services/queries'
import PromoCard from './PromoCard'
import styles from './PromosList.module.scss'
import { QUERY_KEYS } from '~/views/home/constants'

interface IPromoList {
    limit?: number
}

export const PromoList = ({ limit = 100 }: IPromoList) => {
    const [loading, setLoading] = useState(true)

    const promos = useQuery(QUERY_KEYS.PROMOS(limit), () => getPromos(limit), {
        refetchOnWindowFocus: false,
    }).data

    useEffect(() => {
        if (promos) setLoading(false)
    }, [promos])

    if (loading || promos === undefined) {
        return (
            <div className='main-banner__slide loading'>
                <Loader />
            </div>
        )
    }

    return promos?.length ? (
        <div className='promotions-page'>
            <div className='promotions-list d-flex flex-wrap'>
                {promos.map(({ id, name, text, image, slug }: any) => (
                    <PromoCard key={id} promo={slug} name={name} text={text} image={image} />
                ))}
            </div>
        </div>
    ) : (
        <div className={styles.not_available}>В данный момент нет активных акций</div>
    )
}
export default memo(PromoList)
