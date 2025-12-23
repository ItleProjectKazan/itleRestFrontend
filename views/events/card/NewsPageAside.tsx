import { memo } from 'react'
import { useQuery } from 'react-query'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { TNews } from '~/types/pages/news'
import { getPagePreview } from '~/services/queries'
import { QUERY_KEYS } from '~/views/home/constants'
import { Loader } from '~/components'
import { TPagePreview } from '~/types/pages/page'
import Link from 'next/link'
import { PageLinks } from '~/constants/pageLinks'

const NewsPageAside = () => {
    const limit = 8
    const offset = 0
    const news = useQuery<TPagePreview<TNews[]>, TNews[]>(
        QUERY_KEYS.PAGES_PREVIEW('event', limit, offset),
        () => getPagePreview<TPagePreview<TNews[]>, TNews[]>('event', limit, offset),
        {
            refetchOnWindowFocus: false,
        },
    ).data

    if (!news) {
        return (
            <div className='main-banner__slide loading'>
                <Loader />
            </div>
        )
    }
    return (
        <div className='event-page__aside'>
            <div className='events-list d-flex flex-wrap'>
                {news.content_pages?.map(({ title, date, updated_at, image, id }) => (
                    <div key={id} className='events-list__item d-flex'>
                        <Link href={PageLinks.NEWS + '/' + id} className='events-list__item-inner d-flex flex-column'>
                            <div
                                className='events-list__item-image'
                                style={{ backgroundImage: `url('${image}')` }}
                            ></div>
                            <span className='events-list__item-date'>
                                {format(new Date(date || updated_at), 'dd MMMM', {
                                    locale: ru,
                                })}
                            </span>
                            <h3 className='events-list__item-title'>{title}</h3>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default memo(NewsPageAside)
