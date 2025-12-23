import React, { FC, useState, MouseEvent } from 'react'
import Image from 'next/legacy/image'
import SwiperCore, { Navigation, Pagination, Scrollbar } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import Link from 'next/link'
import { Loader } from '~/components'
import { TBanner } from '~/types/misc'
import { useStore } from '~/hooks'
import { getMenuLink } from '~/constants/pageLinks'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/scrollbar'
import 'swiper/css/pagination'
import LeftIcon from '~/public/images/angle-left.svg'
import RightIcon from '~/public/images/angle-right.svg'

SwiperCore.use([Scrollbar, Navigation, Pagination])

interface Props {
    banners: TBanner[]
}

interface SlideProps {
    banner: TBanner
}

const Slide: FC<SlideProps> = ({ banner }) => {
    const { bookingModal, orderParams } = useStore()
    const title = banner.title?.replace(/\*\*(.*?)\*\*/g, '<mark>$1</mark>') ?? null
    const url = banner.url
    const SlideComponent =
        banner.button_label === null && url !== null
            ? (props: any) => {
                  return (
                      <div
                          className='main-banner__slide'
                          style={{
                              backgroundImage: `url(${banner.background_image ?? '/images/product-image-placeholder.svg'})`,
                          }}
                      >
                          <Link href={url} {...props} />
                      </div>
                  )
              }
            : 'div'

    const [isLoaded, setLoaded] = useState(false)
    const doBooking = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        e.preventDefault()
        bookingModal.open()
    }
    if (!isLoaded) {
        return (
            <SlideComponent className='main-banner__slide loading'>
                <Loader white={false} />
                <Image
                    alt='banner loading image'
                    className='invisible-image'
                    layout='fill'
                    objectFit='contain'
                    onLoadingComplete={() => setLoaded(true)}
                    src={banner.background_image ? banner.background_image : '/images/product-image-placeholder.svg'}
                    unoptimized
                />
            </SlideComponent>
        )
    } else {
        return (
            <SlideComponent
                className='main-banner__slide'
                style={{
                    backgroundImage: `url(${banner.background_image ?? '/images/product-image-placeholder.svg'})`,
                }}
            >
                <div className='main-banner__slide-content d-flex flex-wrap'>
                    <div className='main-banner__slide-info d-flex flex-column items-start'>
                        <span className='main-banner__slide-label d-flex items-center'>мясной семейный ресторан</span>
                        {title !== null && (
                            <h2
                                className='main-banner__slide-title'
                                lang='ru'
                                dangerouslySetInnerHTML={{ __html: title }}
                            />
                        )}
                        <div className='main-banner__slide-buttons d-flex'>
                            <button
                                onClick={doBooking}
                                className='main-banner__slide-btn main-banner__slide-btn--primary d-flex items-center justify-center transition'
                            >
                                Забронировать стол
                            </button>

                            <Link
                                href={getMenuLink(orderParams.restaurantId)}
                                className='main-banner__slide-btn main-banner__slide-btn--border d-flex items-center justify-center transition'
                            >
                                Заказать доставку
                            </Link>
                        </div>
                    </div>
                    {banner.icon_one ||
                    banner.icon_one_description ||
                    banner.icon_two ||
                    banner.icon_two_description ||
                    banner.icon_three ||
                    banner.icon_three_description ? (
                        <div className='slide-details'>
                            {banner.icon_one || banner.icon_one_description ? (
                                <div className='slide-details__item d-flex items-center'>
                                    {banner.icon_one && (
                                        <img
                                            src={banner.icon_one}
                                            className='slide-details__item-icon'
                                            alt='main banner details image'
                                        />
                                    )}
                                    {banner.icon_one_description && (
                                        <span className='slide-details__item-title'>{banner.icon_one_description}</span>
                                    )}
                                </div>
                            ) : null}
                            {banner.icon_two || banner.icon_two_description ? (
                                <div className='slide-details__item d-flex items-center'>
                                    {banner.icon_two && (
                                        <img
                                            src={banner.icon_two}
                                            className='slide-details__item-icon'
                                            alt='main banner details image'
                                        />
                                    )}
                                    {banner.icon_two_description && (
                                        <span className='slide-details__item-title'>{banner.icon_two_description}</span>
                                    )}
                                </div>
                            ) : null}

                            {banner.icon_three || banner.icon_three_description ? (
                                <div className='slide-details__item d-flex items-center'>
                                    {banner.icon_three && (
                                        <img
                                            src={banner.icon_three}
                                            className='slide-details__item-icon'
                                            alt='main banner details image'
                                        />
                                    )}
                                    {banner.icon_three_description && (
                                        <span className='slide-details__item-title'>
                                            {banner.icon_three_description}
                                        </span>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </SlideComponent>
        )
    }
}

const Banner: FC<Props> = ({ banners }) => {
    return (
        <section className='main-banner'>
            <div className='container'>
                <div className='main-banner__inner'>
                    <Swiper
                        autoplay={{
                            delay: 15000,
                        }}
                        id='desktopSwiper'
                        loop
                        lazy
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }}
                        pagination={{
                            dynamicBullets: true,
                        }}
                        slidesPerView={1}
                        freeMode={true}
                        spaceBetween={10}
                    >
                        {banners?.map((banner) => (
                            <SwiperSlide key={banner.id}>
                                <Slide banner={banner} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <span className='swiper-button-prev transition'>
                        <LeftIcon />
                    </span>
                    <span className='swiper-button-next transition'>
                        <RightIcon />
                    </span>
                </div>
            </div>
        </section>
    )
}

export default Banner
