import { FC, useState } from 'react'
import Image from 'next/legacy/image'
import SwiperCore, { Scrollbar, Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import classNames from 'classnames'
import { Loader } from '~/components'

import LeftIcon from '~/public/images/angle-left.svg'
import RightIcon from '~/public/images/angle-right.svg'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import styles from './ContentImageCarousel.module.scss'

SwiperCore.use([Scrollbar, Navigation, Pagination])

type Props = {
    images: []
}

interface SlideProps {
    image: string
}

const Slide: FC<SlideProps> = ({ image }) => {
    const [isLoaded, setLoaded] = useState(false)

    if (!isLoaded) {
        return (
            <a className={styles.slide_is_loading}>
                <Loader white={false} />
                <Image
                    alt=''
                    className={styles.invicible_image}
                    layout='fill'
                    objectFit='contain'
                    onLoadingComplete={() => setLoaded(true)}
                    src={image}
                />
            </a>
        )
    } else {
        return (
            <a className={styles.slide}>
                <div className={styles.backgroundImage}>
                    <Image alt='' layout='fill' objectFit='contain' src={image} />
                </div>
            </a>
        )
    }
}

const ContentImageCarousel: FC<Props> = ({ images }) => {
    return (
        <section className={styles.carousel}>
            <Swiper
                autoplay={{
                    delay: 15000,
                }}
                loop
                pagination={{
                    el: `.${styles.pagination}`,
                    type: 'bullets',
                    clickable: true,
                }}
                slidesPerGroup={1}
                slidesPerView={1}
                spaceBetween={10}
                navigation={{
                    nextEl: '#next_',
                    prevEl: '#prev_',
                }}
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <Slide image={image} />
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className={styles.buttons}>
                <a id={'prev_'} className={styles.swiperButtonPrev}>
                    <LeftIcon width={40} />
                </a>
                <a id={'next_'} className={styles.swiperButtonNext}>
                    <RightIcon width={40} />
                </a>
            </div>
            <div className={classNames('swiper-pagination', styles.pagination)} />
        </section>
    )
}

export { ContentImageCarousel }
