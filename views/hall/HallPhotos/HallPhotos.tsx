import React, { FC } from 'react'
import classNames from 'classnames'
import SwiperCore, { Navigation, Pagination, Scrollbar } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/scrollbar'
import 'swiper/css/pagination'
import styles from './HallPhotos.module.scss'

import LeftIcon from '~/public/images/angle-left.svg'
import RightIcon from '~/public/images/angle-right.svg'

SwiperCore.use([Scrollbar, Navigation, Pagination])

interface Props {
    id: number
    images: JSX.Element[]
}

interface SlideProps {
    image: JSX.Element
    className: string
}

const Slide: FC<SlideProps> = ({
    image,
    className
}) => {

    return (
        <div
            className={className}
        >
            {image}
        </div>
    )
}


export const HallPhotos: FC<Props> = ({
    id,
    images,
}) => {

    return (
        <section className={styles.banner}>
            <div className={'container'}>
                <div className={styles.header}><span>галерея</span> мероприятий</div>
                <div className={styles.subheader}>Мы провели более 105 мероприятий</div>
            </div>
            <div className={styles.swiperBlock}>
                <Swiper
                    id={'hall_id_' + id}
                    autoplay={{
                        delay: 15000,
                    }}
                    centeredSlides={true}
                    centerInsufficientSlides={true}
                    loop
                    navigation={{
                        nextEl: '#next_' + id,
                        prevEl: '#prev_' + id,
                    }}
                    pagination={{
                        el: `.${styles.pagination}`,
                        type: 'bullets',
                        clickable: true,
                    }}
                    slidesPerGroup={1}
                    slidesPerView={1}
                    spaceBetween={15}
                    breakpoints={{
                        640: {
                            slidesPerView: 1,
                            centerInsufficientSlides: false,
                            centeredSlides: false,
                        },
                        768: {
                            slidesPerView: 2,
                            centerInsufficientSlides: false,
                            centeredSlides: false,
                        },
                        1024: {
                            slidesPerView: 3,
                        },
                        1400: {
                            slidesPerView: 4,
                        },
                    }}
                // slidesPerGroup={ 3 }
                // slidesPerView="auto"
                // spaceBetween={ 1 }
                >
                    {
                        images.map(image => (
                            <SwiperSlide key={image.key}>
                                <Slide image={image} className={styles.slide} />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>
            <div className={styles.buttons}>
                <a id={'prev_' + id} className={styles.swiperButtonPrev}>
                    <LeftIcon width={40} />
                </a>
                <a id={'next_' + id} className={styles.swiperButtonNext} >
                    <RightIcon width={40} />
                </a>
            </div>
            <div className={classNames('swiper-pagination', styles.pagination)} />
        </section>
    )
}


export const SmallHallPhotos: FC<Props> = ({
    id,
    images,
}) => {

    return (
        <section className={styles.smallBanner}>
            <Swiper
                id={'hall_id_' + id}
                className={styles.swiper}
                autoplay={{
                    delay: 15000,
                }}
                loop
                navigation={{
                    nextEl: '#next_' + id,
                    prevEl: '#prev_' + id,
                }}
                slidesPerGroup={1}
                slidesPerView={1}
                spaceBetween={1}
            >
                {
                    images.map(image => (
                        <SwiperSlide key={image.key}>
                            <Slide image={image} className={styles.smallslide} />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
            <a id={'prev_' + id} className={styles.swiperSmallButtonPrev}>
                <LeftIcon width={40} />
            </a>
            <a id={'next_' + id} className={styles.swiperSmallButtonNext} >
                <RightIcon width={40} />
            </a>
        </section>
    )
}
