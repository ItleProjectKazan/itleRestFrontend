import { FC, useEffect, useState } from 'react'
import Sticky from 'react-stickynode'
import Image from 'next/legacy/image'
import classNames from 'classnames'
import SwiperCore, { Scrollbar, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { smoothScrollHandler } from '~/helpers/smoothScroll'

import { CartIcon } from '~/components'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/scrollbar'

import { TCategory } from '~/types/catalog'

import styles from './StickyHeader.module.scss'

SwiperCore.use([Scrollbar, Navigation])

interface Props {
    activeCategoryCode: string | null
    categories: TCategory[]
    showCategory: (category: TCategory) => boolean
}

const StickyHeader: FC<Props> = ({ activeCategoryCode, categories, showCategory }) => {
    // храним инстанс свайпера
    const [swiper, setSwiper] = useState(null)

    // при смене активной категории делаем подскрол
    // к предыдущей в списке чтобы визуально была по центру
    useEffect(() => {
        const idx = categories.findIndex((cat) => cat.code === activeCategoryCode)
        if (swiper && idx > 0) {
            // @ts-ignore
            swiper.slideTo(idx - 1)
        }
    }, [activeCategoryCode, categories, swiper])

    return (
        <Sticky innerZ={99} top={0}>
            {(status: any) => (
                <div
                    className={classNames(styles.stickyHeader, {
                        [styles.stickyHeaderVisible]: status.status === Sticky.STATUS_FIXED,
                    })}
                >
                    <div className={classNames('container', styles.content)}>
                        <a className={styles.logo} href='#' onClick={smoothScrollHandler}>
                            <Image alt='logo' height={22} src='/images/logo-bistro.svg' width={77} />
                        </a>
                        <Swiper
                            className={styles.slider}
                            // @ts-ignore
                            onSwiper={(swiper) => setSwiper(swiper)}
                            slidesPerView='auto'
                            spaceBetween={28}
                        >
                            {categories.map((category) => {
                                if (!showCategory(category)) {
                                    return null
                                }

                                return (
                                    <SwiperSlide
                                        key={category.id}
                                        className={classNames(styles.category, {
                                            [styles.categoryActive]: activeCategoryCode === category.code,
                                        })}
                                    >
                                        <a
                                            className={styles.categoryLink}
                                            href={'#' + category.code}
                                            onClick={smoothScrollHandler}
                                        >
                                            {category.name}
                                        </a>
                                    </SwiperSlide>
                                )
                            })}
                        </Swiper>

                        <div className={styles.cart}>
                            <CartIcon />
                        </div>
                    </div>
                </div>
            )}
        </Sticky>
    )
}

export { StickyHeader }
