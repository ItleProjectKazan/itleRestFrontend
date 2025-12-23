import { useState, FC, memo, useEffect, useMemo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useStore } from '~/hooks'
import { Thumbs } from 'swiper'
import { TCategory } from '~/types/catalog'
import { useQuery } from 'react-query'
import { getCategories } from '~/services/queries'
import { QUERY_KEYS } from '~/views/home/constants'
import { Loader } from '~/components'
import { getMenuLink, PageLinks } from '~/constants/pageLinks'
import Link from 'next/link'

const CategoriesSlider: FC = () => {
    const [loading, setLoading] = useState(true)
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)

    const { localities, orderParams } = useStore()

    const restaurantId = useMemo(() => {
        const locality = localities.find((locality) => locality.is_default)
        if (!locality || locality.restaurants.length === 0) return undefined
        const restaurant = locality?.restaurants.find((locality) => locality.is_default) ?? locality.restaurants[0]
        return restaurant.id
    }, [])

    useEffect(() => {
        setLoading(false)
    }, [])

    const categories = useQuery<TCategory[]>(QUERY_KEYS.CATEGORIES(restaurantId), () => getCategories(restaurantId), {
        refetchOnWindowFocus: false,
    }).data

    const filteredCategories = useMemo(() => categories?.filter(({ is_visible }) => is_visible) || [], [categories])

    if (!categories || loading) {
        return (
            <div className='main-banner__slide loading'>
                <Loader />
            </div>
        )
    }

    return (
        <section className='section-page categories-info'>
            <div className='container'>
                <div className='categories-info__inner d-flex flex-wrap justify-center'>
                    <div className='categories-info__inner-image d-flex justify-center'>
                        <img src='/images/categories-info-bg-image.png' alt='categories info background image' />
                    </div>
                    <div className='categories-slider'>
                        <div className='big-slider'>
                            <Swiper
                                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                spaceBetween={10}
                                loop
                                lazy
                                navigation={{
                                    prevEl: '.prev-slide-categories',
                                    nextEl: '.next-slide-categories',
                                }}
                                modules={[Thumbs]}
                            >
                                {filteredCategories.map(({ image, name, text, id, code }) => (
                                    <SwiperSlide key={id}>
                                        <Link href={PageLinks.MENU + '#' + code}>
                                            <div
                                                className='big-slider__slide d-flex'
                                                style={{ backgroundImage: `url('${image}')` }}
                                            >
                                                <div className='big-slider__slide-inner d-flex flex-column'>
                                                    <h3 className='big-slider__slide-title'>{name}</h3>
                                                    <div className='big-slider__slide-text'>
                                                        <p>{text}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <button
                                aria-label='prev'
                                className='prev-slide-categories big-slider__btn big-slider__btn--prev circle-center transition'
                            >
                                <span className='icon-angle-left'></span>
                            </button>
                            <button
                                aria-label='next'
                                className='next-slide-categories big-slider__btn big-slider__btn--next circle-center transition'
                            >
                                <span className='icon-angle-right'></span>
                            </button>
                        </div>
                        <div className='small-slider'>
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                spaceBetween={10}
                                slidesPerView={6}
                                freeMode={false}
                                loop
                                lazy
                                watchSlidesProgress={false}
                                navigation={{
                                    prevEl: '.prev-slide-categories',
                                    nextEl: '.next-slide-categories',
                                }}
                                breakpoints={{
                                    320: {
                                        slidesPerView: 3,
                                        spaceBetween: 3,
                                    },
                                    576: {
                                        slidesPerView: 4,
                                        spaceBetween: 5,
                                    },
                                    768: {
                                        slidesPerView: 6,
                                        spaceBetween: 10,
                                    },
                                }}
                            >
                                {filteredCategories.map(({ icon, category_name, id }) => (
                                    <SwiperSlide key={id}>
                                        <div className='small-slider__slide d-flex flex-column items-center justify-center transition'>
                                            <img
                                                src={icon}
                                                alt='category icon'
                                                className='small-slider__slide-icon transition'
                                            />
                                            <span className='small-slider__slide-title transition'>
                                                {category_name}
                                            </span>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>

                    <a
                        href={getMenuLink(orderParams.restaurantId)}
                        className='categories-info__link d-flex items-center transition'
                    >
                        Смотреть меню
                        <span className='icon-angle-right transition'></span>
                    </a>
                </div>
            </div>
        </section>
    )
}
export default memo(CategoriesSlider)
