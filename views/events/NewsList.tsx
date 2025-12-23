import { memo, useState, useEffect } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { TNews } from '~/types/pages/news'
import Pagination from '~/components/Pagination'
import { QUERY_KEYS } from '~/views/home/constants'
import { Loader } from '~/components'
import { useQuery } from 'react-query'
import { getPagePreview } from '~/services/queries'
import { ru } from 'date-fns/locale'
import { TPagePreview } from '~/types/pages/page'

const NewsList = () => {
    const [page, setPage] = useState(1)
    const [pagesCount, setPagesCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [news, setNews] = useState<TNews[]>([])
    const limit = 6
    const offset = (page - 1) * limit

    const newsResponse = useQuery<TPagePreview<TNews[]>, TNews[]>(
        QUERY_KEYS.PAGES_PREVIEW('event', limit, offset),
        () => getPagePreview<TPagePreview<TNews[]>, TNews[]>('event', limit, offset),
        {
            refetchOnWindowFocus: false,
        },
    ).data

    useEffect(() => {
        if (newsResponse?.content_pages) {
            setNews(newsResponse.content_pages)
            const pCount = Math.ceil(newsResponse.count / limit)
            setPagesCount(pCount)
        }
        setLoading(false)
    }, [newsResponse])

    const pageClick = (page: number) => {
        setPage(page)
        setLoading(true)
    }

    if (loading) {
        return (
            <div className='main-banner__slide loading'>
                <Loader />
            </div>
        )
    }
    return (
        <>
            <div className='events-list d-flex flex-wrap'>
                {news.map(({ title, date, image, id }) => (
                    <div className='events-list__item d-flex' key={id}>
                        <Link
                            className='events-list__item-inner d-flex'
                            href={`/events/${id}`}
                            style={{ backgroundImage: `url('${image}')` }}
                        >
                            <div className='events-list__item-content d-flex items-end'>
                                <svg
                                    className='events-list__item-icon'
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
                                <div className='events-list__item-info d-flex flex-column'>
                                    <h3 className='events-list__item-title'>{title}</h3>
                                    <span className='events-list__item-date'>
                                        {format(new Date(date), 'dd MMMM yyyy', {
                                            locale: ru,
                                        })}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            <Pagination pagesCount={pagesCount} currentPage={page} pageClick={pageClick} />
        </>
    )
}

export default memo(NewsList)
