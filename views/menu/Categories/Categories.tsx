import React, { FC, useEffect, useMemo, useState } from 'react'
import SwiperCore, { Scrollbar, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/legacy/image'
import { TCategory } from '~/types/catalog'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/scrollbar'
import styles from './Categories.module.scss'
import { smoothScrollHandler } from '~/helpers/smoothScroll'
import cn from 'classnames'
import Link from 'next/link'

SwiperCore.use([Scrollbar, Navigation])

interface Props {
    categories: TCategory[]
    activeCategoryCode?: string | null
    showCategory: (category: TCategory) => boolean
    disableSmooth?: boolean
}

const Categories: FC<Props> = ({ categories, activeCategoryCode, showCategory }) => {
    const [swiper, setSwiper] = useState(null)

    const catigor = useMemo(
        () =>
            categories.reduce((cur: TCategory[], category: TCategory) => {
                if (showCategory(category)) {
                    cur.push(category)
                    return cur
                }
                return cur
            }, []),
        [categories],
    )

    useEffect(() => {
        const idx = catigor.findIndex((cat) => cat.code === activeCategoryCode)

        // @ts-ignore
        if (!swiper || !swiper?.slides || !swiper?.slides?.length) return

        if (idx >= 0) {
            // @ts-ignore
            swiper.slideTo(idx)
            setTimeout(() => {
                // @ts-ignore
                swiper.slides.map((item) => {
                    item.classList.remove('swiper-slide-active')
                    item.classList.remove('swiper-slide-next')
                    item.classList.remove('swiper-slide-prev')
                })
                // @ts-ignore
                swiper.slides[idx].classList.add('swiper-slide-active')
                // @ts-ignore
                if (idx < swiper.slides.length - 1) {
                    // @ts-ignore
                    swiper.slides[idx + 1].classList.add('swiper-slide-next')
                    // @ts-ignore
                    swiper.navigation.nextEl.classList.remove('swiper-button-disabled')
                } else {
                    // @ts-ignore
                    swiper.navigation.nextEl.classList.add('swiper-button-disabled')
                }
                if (idx !== 0) {
                    // @ts-ignore
                    swiper.slides[idx - 1].classList.add('swiper-slide-prev')
                }
            }, 10)
        } else {
            // @ts-ignore
            swiper.slides.map((item) => {
                item.classList.remove('swiper-slide-active')
                item.classList.remove('swiper-slide-next')
                item.classList.remove('swiper-slide-prev')
            })
            // @ts-ignore
            swiper.slides[0].classList.add('swiper-slide-active')
            // @ts-ignore
            swiper.slideTo(0)
        }
    }, [activeCategoryCode, catigor, swiper])

    const nextBlockCode = useMemo(() => {
        const idx = catigor.findIndex((cat) => cat.code === activeCategoryCode)
        return idx < catigor.length - 1 ? catigor[idx + 1].code : null
    }, [activeCategoryCode, catigor])

    const prevBlockCode = useMemo(() => {
        const idx = catigor.findIndex((cat) => cat.code === activeCategoryCode)
        return idx > 0 ? catigor[idx - 1].code : null
    }, [activeCategoryCode, catigor])

    return (
        <div className='menu-page__categories d-flex'>
            <Swiper
                className={styles.swiper}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                slidesPerView={'auto'}
                spaceBetween={10}
                // onClick={onClick}
                //@ts-ignore
                onSwiper={(swiper) => setSwiper(swiper)}
                normalizeSlideIndex
                tabIndex={3}
                breakpoints={{
                    320: {
                        spaceBetween: 5,
                    },
                    576: {
                        spaceBetween: 7,
                    },
                    768: {
                        spaceBetween: 10,
                    },
                }}
            >
                {catigor.map((category) => {
                    return (
                        <SwiperSlide
                            className={cn({ 'swiper-slide-active': category.code === activeCategoryCode })}
                            key={category.id}
                        >
                            <Link
                                className='menu-page__categories-item d-flex items-center transition'
                                href={'#' + category.code}
                                onClick={smoothScrollHandler}
                            >
                                <div className='item-icon'>
                                    {category.icon && <Image layout='fill' alt='' src={category.icon} />}
                                </div>
                                {category.category_name}
                            </Link>
                        </SwiperSlide>
                    )
                })}
            </Swiper>

            <a
                href={'#' + prevBlockCode}
                onClick={smoothScrollHandler}
                className='swiper-button-prev d-flex block-center transition'
            >
                <span className='icon-angle-left'></span>
            </a>
            <a
                href={'#' + nextBlockCode}
                onClick={smoothScrollHandler}
                className='swiper-button-next d-flex block-center transition'
            >
                <span className='icon-angle-right'></span>
            </a>
        </div>
    )
}

export { Categories }
