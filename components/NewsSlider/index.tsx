import { memo, useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useQuery } from 'react-query'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { TNews } from '~/types/pages/news'
import { getPagePreview } from '~/services/queries'
import { QUERY_KEYS } from '~/views/home/constants'
import { Loader } from '~/components'
import { TPagePreview } from '~/types/pages/page'

interface INewsSlider {
    limit?: number
    offset?: number
}

const NewsSlider: NextPage<INewsSlider> = ({ limit = 5, offset = 0 }: INewsSlider) => {
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        setLoading(false)
    }, [])

    const news = useQuery<TPagePreview<TNews[]>, TNews[]>(
        QUERY_KEYS.PAGES_PREVIEW('event', limit, offset),
        () => getPagePreview<TPagePreview<TNews[]>, TNews[]>('event', limit, offset),
        {
            refetchOnWindowFocus: false,
        },
    ).data

    if (loading) {
        return (
            <div className='main-banner__slide loading'>
                <Loader />
            </div>
        )
    }
    if (!news) return null

    return (
        <section className='section-page events'>
            <div className='container'>
                <div className='events__inner d-flex flex-wrap justify-center'>
                    <h2 className='events__title section-title d-flex justify-between items-center'>
                        События
                        <div className='events-slider__buttons d-flex'>
                            <button
                                aria-label='prev'
                                className='prev-slide-news events-slider__buttons-btn circle-center transition'
                            >
                                <span className='icon-angle-left'></span>
                            </button>
                            <button
                                aria-label='next'
                                className='next-slide-news events-slider__buttons-btn circle-center transition'
                            >
                                <span className='icon-angle-right'></span>
                            </button>
                        </div>
                    </h2>

                    <div className='events-slider'>
                        <Swiper
                            slidesPerView={3}
                            spaceBetween={15}
                            loop={true}
                            navigation={{
                                prevEl: '.prev-slide-news',
                                nextEl: '.next-slide-news',
                            }}
                            pagination={{
                                dynamicBullets: true,
                            }}
                            breakpoints={{
                                320: {
                                    slidesPerView: 1.3,
                                    spaceBetween: 5,
                                    centeredSlides: true,
                                },
                                450: {
                                    slidesPerView: 2,
                                    spaceBetween: 10,
                                },
                                768: {
                                    slidesPerView: 3,
                                    spaceBetween: 15,
                                },
                            }}
                        >
                            {news?.content_pages?.map(({ title, date, image, id }) => (
                                <SwiperSlide key={id}>
                                    <a
                                        href={`/events/${id}`}
                                        className='events-slider__slide d-flex'
                                        style={{ backgroundImage: `url('${image}')` }}
                                    >
                                        <div className='events-slider__slide-inner d-flex items-end'>
                                            <svg
                                                className='events-slider__slide-icon'
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
                                            <div className='events-slider__slide-info d-flex flex-column'>
                                                <h3 className='events-slider__slide-title'>{title}</h3>
                                                <span className='events-slider__slide-date'>
                                                    {format(new Date(date), 'dd MMMM yyyy', {
                                                        locale: ru,
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    <Link href='/events' className='events__link d-flex items-center transition'>
                        Все события
                        <span className='icon-angle-right transition'></span>
                    </Link>
                </div>
            </div>
        </section>
    )
}
export default memo(NewsSlider)
