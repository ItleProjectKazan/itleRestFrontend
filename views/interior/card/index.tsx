import React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { getRecomendedProducts } from '~/services/queries'
import { Layout, Section } from '~/components'
import { getPage } from '~/services/queries'
import { Swiper, SwiperSlide } from 'swiper/react'
import { TPage, TEstablishmentCard } from '~/types/pages/page'
import NewsSlider from '~/components/NewsSlider'
import RestorauntShedule from '~/components/RestorauntShedule'
import { useStore } from '~/hooks'
import { TProduct } from '~/types/catalog'
import { RESTAURANT_COOKIE } from '~/constants/misc'
import { parseRestaurantCookie, getRestaurant } from '~/helpers'

interface IInteriorCard {
    id: string
    content_page: TEstablishmentCard
    recommendedProducts: TProduct[]
}

const InteriorCard: NextPage<IInteriorCard> = ({ id, content_page, recommendedProducts = [] }: IInteriorCard) => {
    const { bookingModal } = useStore()
    const doBooking = (id: string) => () => {
        bookingModal.open(Number(id))
    }
    const title = content_page?.seo?.seo_title || 'ИТЛЕ-СТЕЙК КАФЕ | Локации | ' + content_page?.first?.main_title
    const description =
        content_page?.seo?.seo_description || 'ИТЛЕ-СТЕЙК КАФЕ | Локации ' + content_page?.first?.main_title

    return (
        <Layout title={title} description={description} recommendedProducts={recommendedProducts}>
            <Section
                className='institution-page d-flex flex-wrap'
                breadcrumbs={[
                    {
                        link: '/interior',
                        title: 'Локация',
                    },
                    {
                        title: content_page?.first?.main_title || '',
                    },
                ]}
                title='стейк–кафе на меридианной'
            >
                <section className='section-page institution-hero'>
                    <div className='container'>
                        <div className='institution-hero__inner'>
                            <div
                                className='institution-hero__content'
                                style={{ backgroundImage: `url('${content_page?.image}')` }}
                            >
                                <div className='institution-hero__content-inner d-flex flex-column items-start'>
                                    <h1 className='institution-hero__content-title section-title'>
                                        стейк–кафе <br />
                                        {content_page?.first.main_title}
                                    </h1>
                                    <button
                                        onClick={doBooking(id)}
                                        className='institution-hero__content-btn d-flex items-center transition'
                                    >
                                        Забронировать стол
                                    </button>
                                    <div
                                        className='institution-hero__content-description'
                                        dangerouslySetInnerHTML={{
                                            __html: content_page?.first?.description || '',
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {content_page?.second?.image ? (
                    <section className='section-page about-institution'>
                        <div className='container'>
                            <div className='about-institution__inner d-flex flex-wrap'>
                                <div className='about-institution__image'>
                                    {content_page?.second.image ? (
                                        <img
                                            src={content_page.second.image}
                                            className='about-institution__image-img'
                                            alt='about institution image'
                                        />
                                    ) : null}
                                </div>

                                <div className='about-institution__info'>
                                    <h2 className='about-institution__info-title section-title'>
                                        Открытость <span>процесса</span>
                                    </h2>
                                    {content_page?.second?.description ? (
                                        <div
                                            className='about-institution__info-text'
                                            dangerouslySetInnerHTML={{
                                                __html: content_page.second.description,
                                            }}
                                        ></div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </section>
                ) : null}

                <section className='section-page institution-halls'>
                    <div className='container'>
                        <div className='institution-halls__inner d-flex flex-wrap'>
                            {content_page?.third?.slider?.length ? (
                                <div className='institution-hall d-flex flex-wrap section-page items-start'>
                                    <div className='institution-hall__info'>
                                        <h2 className='institution-hall__info-title section-title'>
                                            зал <span>стейк-кафе</span>
                                        </h2>
                                        {content_page?.third?.description ? (
                                            <div
                                                className='institution-hall__info-text'
                                                dangerouslySetInnerHTML={{
                                                    __html: content_page.third.description,
                                                }}
                                            ></div>
                                        ) : null}
                                        <button
                                            onClick={doBooking(id)}
                                            className='institution-hall__info-btn d-flex items-center transition'
                                        >
                                            Забронировать стол
                                        </button>
                                    </div>
                                    {content_page?.third?.slider?.length && (
                                        <div className='hall-slider'>
                                            <Swiper
                                                slidesPerView={1}
                                                spaceBetween={10}
                                                loop={true}
                                                lazy={true}
                                                navigation={{
                                                    prevEl: '.prevSlider1Btn',
                                                    nextEl: '.nextSlider1Btn',
                                                }}
                                                pagination={{
                                                    clickable: true,
                                                }}
                                                breakpoints={{
                                                    320: {
                                                        slidesPerView: 1.3,
                                                        spaceBetween: 5,
                                                        centeredSlides: true,
                                                    },
                                                    450: {
                                                        slidesPerView: 1,
                                                        spaceBetween: 10,
                                                        centeredSlides: false,
                                                    },
                                                }}
                                            >
                                                {content_page.third.slider.map((img, index) => (
                                                    <SwiperSlide key={index}>
                                                        <div className='hall-slider__slide'>
                                                            <img
                                                                src={img}
                                                                className='hall-slider__slide-image'
                                                                loading='lazy'
                                                                alt='hall image'
                                                            />
                                                        </div>
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>

                                            <div className='hall-slider__buttons d-flex justify-center'>
                                                <button className='prevSlider1Btn hall-slider__buttons-btn circle-center transition'>
                                                    <span className='icon-angle-left'></span>
                                                </button>
                                                <button className='nextSlider1Btn hall-slider__buttons-btn circle-center transition'>
                                                    <span className='icon-angle-right'></span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : null}
                            {content_page?.forth?.slider?.length ? (
                                <div className='institution-hall is-revert d-flex flex-wrap section-page items-start'>
                                    <div className='institution-hall__info'>
                                        <h2 className='institution-hall__info-title section-title'>
                                            зал <span>Фэмили</span>
                                        </h2>
                                        {content_page?.forth?.description ? (
                                            <div
                                                className='institution-hall__info-text'
                                                dangerouslySetInnerHTML={{ __html: content_page.forth.description }}
                                            ></div>
                                        ) : null}
                                        <button
                                            onClick={doBooking(id)}
                                            className='institution-hall__info-btn d-flex items-center transition'
                                        >
                                            Забронировать стол
                                        </button>
                                    </div>
                                    {content_page?.forth?.slider?.length ? (
                                        <div className='hall-slider'>
                                            <Swiper
                                                slidesPerView={1}
                                                spaceBetween={10}
                                                loop={true}
                                                lazy={true}
                                                navigation={{
                                                    prevEl: '.prevSlider2Btn',
                                                    nextEl: '.nextSlider2Btn',
                                                }}
                                                pagination={{
                                                    clickable: true,
                                                }}
                                                breakpoints={{
                                                    320: {
                                                        slidesPerView: 1.3,
                                                        spaceBetween: 5,
                                                        centeredSlides: true,
                                                    },
                                                    450: {
                                                        slidesPerView: 1,
                                                        spaceBetween: 10,
                                                        centeredSlides: false,
                                                    },
                                                }}
                                            >
                                                {content_page.forth.slider.map((img, index) => (
                                                    <SwiperSlide key={index}>
                                                        <div className='hall-slider__slide'>
                                                            <img
                                                                src={img}
                                                                className='hall-slider__slide-image'
                                                                loading='lazy'
                                                                alt='hall image'
                                                            />
                                                        </div>
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>

                                            <div className='hall-slider__buttons d-flex justify-center'>
                                                <button className='prevSlider2Btn hall-slider__buttons-btn circle-center transition'>
                                                    <span className='icon-angle-left'></span>
                                                </button>
                                                <button className='nextSlider2Btn hall-slider__buttons-btn circle-center transition'>
                                                    <span className='icon-angle-right'></span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </section>
                {content_page?.sixth?.slider?.length ? (
                    <section className='section-page institution-halls'>
                        <div className='container'>
                            <div className='institution-halls__inner d-flex flex-wrap'>
                                <div className='institution-hall d-flex flex-wrap section-page items-start'>
                                    <div className='institution-hall__info'>
                                        <h2 className='institution-hall__info-title section-title'>
                                            комната для <br />
                                            <span>маленьких гостей</span>
                                        </h2>
                                        {content_page?.sixth?.description ? (
                                            <div
                                                className='institution-hall__info-text'
                                                dangerouslySetInnerHTML={{
                                                    __html: content_page.sixth.description || '',
                                                }}
                                            ></div>
                                        ) : null}
                                        <button
                                            onClick={doBooking(id)}
                                            className='institution-hall__info-btn d-flex items-center transition'
                                        >
                                            Забронировать стол
                                        </button>
                                    </div>
                                    {content_page?.sixth?.slider?.length ? (
                                        <div className='hall-slider'>
                                            <Swiper
                                                slidesPerView={1}
                                                spaceBetween={10}
                                                loop={true}
                                                lazy={true}
                                                navigation={{
                                                    prevEl: '.prevSlider4Btn',
                                                    nextEl: '.nextSlider4Btn',
                                                }}
                                                pagination={{
                                                    clickable: true,
                                                }}
                                                breakpoints={{
                                                    320: {
                                                        slidesPerView: 1.3,
                                                        spaceBetween: 5,
                                                        centeredSlides: true,
                                                    },
                                                    450: {
                                                        slidesPerView: 1,
                                                        spaceBetween: 10,
                                                        centeredSlides: false,
                                                    },
                                                }}
                                            >
                                                {content_page.sixth.slider.map((img, index) => (
                                                    <SwiperSlide key={index}>
                                                        <div className='hall-slider__slide'>
                                                            <img
                                                                src={img}
                                                                className='hall-slider__slide-image'
                                                                loading='lazy'
                                                                alt='hall image'
                                                            />
                                                        </div>
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>

                                            <div className='hall-slider__buttons d-flex justify-center'>
                                                <button className='prevSlider4Btn hall-slider__buttons-btn circle-center transition'>
                                                    <span className='icon-angle-left'></span>
                                                </button>
                                                <button className='nextSlider4Btn hall-slider__buttons-btn circle-center transition'>
                                                    <span className='icon-angle-right'></span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </section>
                ) : null}

                {content_page?.fifth?.slider?.length ? (
                    <section className='section-page institution-interiors'>
                        <div className='container'>
                            <div className='institution-interiors__inner d-flex flex-wrap'>
                                <h2 className='institution-interiors__title section-title'>
                                    все интерьеры <span>ИTLE</span>
                                </h2>
                            </div>
                        </div>

                        <div className='interiors-slider'>
                            <Swiper
                                slidesPerView={3.8}
                                spaceBetween={10}
                                loop={true}
                                lazy={true}
                                centeredSlides={true}
                                navigation={{
                                    prevEl: '.prevSlider3Btn',
                                    nextEl: '.nextSlider3Btn',
                                }}
                                pagination={{
                                    clickable: true,
                                }}
                                breakpoints={{
                                    320: {
                                        slidesPerView: 1.4,
                                        spaceBetween: 5,
                                    },
                                    768: {
                                        slidesPerView: 2.2,
                                        spaceBetween: 10,
                                    },
                                    992: {
                                        slidesPerView: 2.6,
                                        spaceBetween: 10,
                                    },
                                    1200: {
                                        slidesPerView: 3,
                                        spaceBetween: 10,
                                    },
                                    1440: {
                                        slidesPerView: 3.4,
                                        spaceBetween: 10,
                                    },
                                    1600: {
                                        slidesPerView: 3.8,
                                        spaceBetween: 10,
                                    },
                                }}
                            >
                                {content_page.fifth.slider.map((img, index) => (
                                    <SwiperSlide key={index}>
                                        <div className='interiors-slider__slide'>
                                            <img
                                                src={img}
                                                className='interiors-slider__slide-image'
                                                loading='lazy'
                                                alt='hall image'
                                                style={{ borderRadius: '20px' }}
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <button className='prevSlider3Btn interiors-slider__btn interiors-slider__btn--prev circle-center transition'>
                                <span className='icon-angle-left'></span>
                            </button>
                            <button className='nextSlider3Btn interiors-slider__btn interiors-slider__btn--next circle-center transition'>
                                <span className='icon-angle-right'></span>
                            </button>
                        </div>
                    </section>
                ) : null}

                {/* <Reviews /> */}

                {content_page?.restaurant?.id && <RestorauntShedule restaurantId={content_page.restaurant.id} />}

                <NewsSlider />
            </Section>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const {
        query: { id },
    } = ctx

    const { content_page } = await getPage<TPage<TEstablishmentCard>, TEstablishmentCard>('establishment', Number(id))
    const cookies = ctx.req.cookies as Record<string, string>
    const cookieRestaurant =
        cookies[RESTAURANT_COOKIE] !== undefined ? parseRestaurantCookie(cookies[RESTAURANT_COOKIE]) : null
    const restaurant = await getRestaurant(Number(cookieRestaurant?.id))
    const recommendedProducts = await getRecomendedProducts(cookies?.cart_id, restaurant?.id)

    return {
        props: {
            id,
            content_page,
            recommendedProducts,
        },
    }
}

export default InteriorCard
