import React from 'react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { observer } from 'mobx-react-lite'
import { getPage } from '~/services/queries'
import { TAbout } from '~/types/pages/about'
import { Layout, Section } from '~/components'
import { Swiper, SwiperSlide } from 'swiper/react'
import { TPage } from '~/types/pages/page'
import { getRecomendedProducts, getSeoTitle } from '~/services/queries'
import NewsSlider from '~/components/NewsSlider'
import { TProduct } from '~/types/catalog'
import { RESTAURANT_COOKIE } from '~/constants/misc'
import { parseRestaurantCookie } from '~/helpers'
import { getRestaurant } from '~/helpers'
import { TSeoTitle } from '~/types/misc'

interface IAbout {
    content_page: TAbout
    recommendedProducts: TProduct[]
    seoTitles: TSeoTitle
}

const About: NextPage<IAbout> = observer(({ content_page, recommendedProducts, seoTitles }: IAbout) => {
    const title = seoTitles?.seo_title || 'ИТЛЕ-СТЕЙК КАФЕ | О проекте'
    const description = seoTitles?.seo_description || 'ИТЛЕ-СТЕЙК КАФЕ | О проекте'

    return (
        <Layout title={title} description={description} recommendedProducts={recommendedProducts}>
            <Section className='about-page d-flex flex-wrap' title={content_page?.title}>
                <section className='section-page about-hero'>
                    <div className='container'>
                        <div className='about-hero__inner'>
                            <div
                                className='about-hero__content'
                                style={{ backgroundImage: `url(${content_page?.first.image})` }}
                            >
                                <div className='about-hero__content-inner d-flex flex-column'>
                                    <h1 className='about-hero__content-title section-title'>
                                        {content_page?.first.main_title}
                                    </h1>
                                    <div className='about-hero__content-description'>
                                        <p>{content_page?.first.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='section-page about-mission'>
                    <img src='/images/about/about-page-mission-bg.svg' className='about-mission__bg' alt='' />
                    <div className='container'>
                        <div className='about-mission__inner d-flex items-center'>
                            <div className='about-mission__info d-flex flex-column items-start'>
                                <h2 className='about-mission__info-title section-title'>
                                    Миссия <span>ИTLE</span>
                                </h2>
                                <div className='about-mission__info-description'>
                                    <p>Преображать жизнь людей через вкусную Halal еду и дружелюбный сервис,</p>
                                    <p>и распространять Halal 360° как актуальную культуру осознанной жизни</p>
                                </div>
                                {/*<button className='about-mission__info-btn d-flex items-center transition'>
                                    Смотреть сертификат Halal
                                    <img
                                        src='/images/about/about-page-mission-certificate-image.png'
                                        alt='certificate image'
                                    />
                                </button>*/}
                                <img
                                    src='images/about/about-page-mission-info-bg.svg'
                                    className='about-mission__info-bg'
                                    alt=''
                                />
                            </div>

                            <div className='about-mission__image'>
                                <img
                                    src='/images/about/about-page-mission-halal.svg'
                                    className='about-mission__image-halal'
                                    alt='halal image'
                                />
                                <img
                                    src='/images/about/about-page-mission-image-bg.svg'
                                    className='about-mission__image-bg'
                                    alt='halal image'
                                />
                                <img
                                    src='/images/about/about-page-mission-image.png'
                                    className='about-mission__image-img'
                                    alt='halal image'
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className='section-page halal-info'>
                    <div className='container'>
                        <div className='halal-info__inner d-flex items-center'>
                            <div className='halal-info__info'>
                                <h2 className='halal-info__info-title section-title'>
                                    <span>Halal 360°</span> днк наших брендов
                                </h2>
                                <div className='halal-info__info-description'>
                                    <p>
                                        Принцип Halal 360° – это образ жизни и движущая сила компании. <br />
                                        В своей работе мы придерживаемся правил Всевышнего, правил дозволенности и
                                        разрешенности во всех процессах и на всех этапах.
                                        <br />
                                        В заведениях вы не встретите алкоголя, дыма кальянов, громкой музыки и нетрезвых
                                        компаний.
                                        <br />
                                        Во всех проектах ИТLE осуществляется шариатский контроль сырья, а для блюд
                                        используются только свежие и качественные продукты от надежных поставщиков.
                                        <br />
                                        В ИТLЕ соблюдается принцип справедливости по отношению ко всем участникам — и к
                                        сотрудникам, и к поставщикам, и к гостям, и к партнерам.
                                        <br />
                                        Насквозь, на 360° мы придерживаемся принципов Halal.
                                    </p>
                                </div>
                            </div>
                            <div className='halal-info__image d-flex justify-center items-center'>
                                <img
                                    src='/images/halal-info-image.png'
                                    alt='about halal image'
                                    className='halal-info__image-img'
                                />
                                <img
                                    src='/images/halal-info-bg.svg'
                                    alt='about halal background image'
                                    className='halal-info__image-bg'
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className='section-page text-block'>
                    <div className='container'>
                        <div className='text-block__inner d-flex items-center'>
                            <div className='text-block__image'>
                                <img
                                    src='/images/about/about-page-text-block-image.png'
                                    className='text-block__image-img'
                                    alt='text block image'
                                />
                            </div>

                            <div className='text-block__info d-flex flex-column justify-center'>
                                <h2 className='text-block__info-title section-title'>
                                    правильное мясо <span>Яркий вкус</span>
                                </h2>
                                <div className='text-block__info-description'>
                                    <p>
                                        Мясо для гриля выдерживается в наших специализированных камерах, где происходит
                                        его ферментация. Это позволяет добиться неповторимой мягкости и сочности наших
                                        фирменных стейков и бургеров, приготовленных на настоящих углях
                                    </p>
                                </div>
                                <img
                                    src='/images/about/about-page-text-block-icon.svg'
                                    className='text-block__info-icon'
                                    alt='text block icon'
                                />
                                <div className='text-block__info-image justify-end'>
                                    <img
                                        src='/images/about/about-page-text-block-image-mob.png'
                                        alt='text block image'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='section-page food-safety'>
                    <div className='container'>
                        <div className='food-safety__inner d-flex flex-wrap items-start'>
                            <div className='food-safety__info d-flex flex-column'>
                                <h2 className='food-safety__info-title section-title'>
                                    Пищевая <span>безопасность</span>
                                </h2>

                                <div className='food-safety__info-description'>
                                    <p>
                                        ИТLE гарантирует на 100% качественную и безопасную Halal продукцию. В своей
                                        работе мы соблюдаем стандарты HACCP (Hazard Analysis Critical Control Points).
                                        Также мы придерживаемся международного стандарта качества ISO 22000. И имеем три
                                        сертификации Halal — ДУМ РТ, Роскачество и международный сертификат Халяль.
                                    </p>
                                </div>
                            </div>

                            <div className='food-safety__slider d-flex block-center'>
                                <img
                                    src='/images/about/food-safety-slider-bg.svg'
                                    className='food-safety__slider-image'
                                    alt='food safety slider background image'
                                />
                                <div className='safety-slider d-flex flex-wrap'>
                                    <Swiper
                                        slidesPerView={2}
                                        spaceBetween={30}
                                        loop={true}
                                        lazy={true}
                                        navigation={{
                                            prevEl: '.prevSlider1BtnRef',
                                            nextEl: '.nextSlider1BtnRef',
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
                                                slidesPerView: 2,
                                                spaceBetween: 15,
                                            },
                                        }}
                                    >
                                        <SwiperSlide>
                                            <Link href='/doc/sertificate_halal.pdf' className='safety-slider__slide'>
                                                <img
                                                    src='/images/about/food-safety-slider-image1.png'
                                                    className='safety-slider__slide-image'
                                                    loading='lazy'
                                                    alt='food safety slide image'
                                                />
                                            </Link>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <Link href='/doc/about_halal.jpeg' className='safety-slider__slide'>
                                                <img
                                                    src='/images/about/food-safety-slider-image2.png'
                                                    className='safety-slider__slide-image'
                                                    loading='lazy'
                                                    alt='food safety slide image'
                                                />
                                            </Link>
                                        </SwiperSlide>
                                        {/* <SwiperSlide>
                                            <div className='safety-slider__slide'>
                                                <img
                                                    src='/images/about/food-safety-slider-image1.png'
                                                    className='safety-slider__slide-image'
                                                    loading='lazy'
                                                    alt='food safety slide image'
                                                />
                                            </div>
                                        </SwiperSlide> */}
                                    </Swiper>

                                    <div className='safety-slider__buttons d-flex justify-center'>
                                        <button className='prevSlider1BtnRef safety-slider__buttons-btn circle-center transition'>
                                            <span className='icon-angle-left'></span>
                                        </button>
                                        <button className='nextSlider1BtnRef safety-slider__buttons-btn circle-center transition'>
                                            <span className='icon-angle-right'></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='section-page values-itle'>
                    <div className='container'>
                        <div className='values-itle__inner'>
                            <h2 className='values-itle__title section-title'>
                                ЦЕННОСТИ <span>ИTLE</span>
                            </h2>

                            <div className='values-list d-flex flex-wrap justify-between'>
                                <div className='values-list__item d-flex flex-column'>
                                    <img
                                        src='/images/about/about-page-values-item-bg.svg'
                                        className='values-list__item-bg'
                                        alt=''
                                    />
                                    <span className='values-list__item-icon icon-halal'></span>
                                    <h3 className='values-list__item-title'>HALAL 360</h3>
                                    <div className='values-list__item-description'>
                                        <p>
                                            Halal – наша главная ценность, основанная на осознанном отношении к себе,
                                            своему предназначению и окружающему нас миру. Halal распространяется на всю
                                            нашу деятельность: на продукты, которые мы создаем, на коммуникации и
                                            поступки, которые мы совершаем. Для нас Halal – это не просто высокий
                                            стандарт, которого мы придерживаемся. Это призыв, который мы несём в этот
                                            мир и преображаем его с помощью вкусной халяль-еды и дружелюбного сервиса.
                                        </p>
                                    </div>
                                </div>
                                <div className='values-list__item d-flex flex-column'>
                                    <img
                                        src='/images/about/about-page-values-item-bg.svg'
                                        className='values-list__item-bg'
                                        alt=''
                                    />
                                    <span className='values-list__item-icon icon-heart'></span>
                                    <h3 className='values-list__item-title'>ЦЕННОСТЬ БОЛЬШЕ ЧЕМ ЦЕНА</h3>
                                    <div className='values-list__item-description'>
                                        <p>
                                            Любовь потребителей – это высшая оценка нашей деятельности. Мы стараемся
                                            заслужить эту любовь и доверие. Мы стремимся создавать продукты, концепции и
                                            уровень сервиса, которые нужны людям, несут пользу, питают необходимыми
                                            ресурсами и доставляют радость. Стремимся давать больше ценности.
                                        </p>
                                    </div>
                                </div>
                                <div className='values-list__item d-flex flex-column'>
                                    <img
                                        src='/images/about/about-page-values-item-bg.svg'
                                        className='values-list__item-bg'
                                        alt=''
                                    />
                                    <span className='values-list__item-icon icon-verification'></span>
                                    <h3 className='values-list__item-title'>100% ОТВЕТСТВЕННОСТЬ</h3>
                                    <div className='values-list__item-description'>
                                        <p>
                                            Мы стремимся, чтобы в нашей команде работали люди, которые осознают
                                            ответственность за свои решения и действия. Во всем – от повседневных задач
                                            до глобальных целей. А это значит, что если что-то не сделано или сделано
                                            плохо, то мы не виним в этом других. Мы ищем причину в своих действиях и
                                            отвечаем за это.
                                        </p>
                                    </div>
                                </div>
                                <div className='values-list__item d-flex flex-column'>
                                    <img
                                        src='/images/about/about-page-values-item-bg.svg'
                                        className='values-list__item-bg'
                                        alt=''
                                    />
                                    <span className='values-list__item-icon icon-diversity'></span>
                                    <h3 className='values-list__item-title'>СОТРУДНИЧЕСТВО</h3>
                                    <div className='values-list__item-description'>
                                        <p>
                                            Мы – команда ИТLE, объединенная общими ценностями и общим делом. Вместе мы
                                            сильнее и нам легче добиваться поставленных целей - и личных целей, и целей
                                            компании. Успех каждого из нас — это успех компании, а победы компании — это
                                            победы каждого из нас.
                                        </p>
                                    </div>
                                </div>
                                <div className='values-list__item d-flex flex-column'>
                                    <img
                                        src='/images/about/about-page-values-item-bg.svg'
                                        className='values-list__item-bg'
                                        alt=''
                                    />
                                    <span className='values-list__item-icon icon-like'></span>
                                    <h3 className='values-list__item-title'>СЕГОДНЯ МЫ ЛУЧШЕ ЧЕМ ВЧЕРА</h3>
                                    <div className='values-list__item-description'>
                                        <p>
                                            А завтра мы хотим быть лучше, чем сегодня. И поэтому на завтра у нас большие
                                            планы! Мы должны развиваться и прогрессировать каждый день. Улучшать наши
                                            продукты и сервис. Предлагать то, чего раньше не было. Мечтать о том, о чем
                                            раньше и не смели. И добиваться этого. Как для компании, так и для себя
                                            лично.
                                        </p>
                                    </div>
                                </div>
                                <div className='values-list__item d-flex flex-column'>
                                    <img
                                        src='/images/about/about-page-values-item-bg.svg'
                                        className='values-list__item-bg'
                                        alt=''
                                    />
                                    <img
                                        src='/images/about/about-page-values-image.png'
                                        alt='values itle image'
                                        className='values-list__item-image'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Section>
            <NewsSlider />
        </Layout>
    )
})

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    try {
        const cookies = ctx.req.cookies as Record<string, string>
        const getPageAwait = getPage<TPage<TAbout>, TAbout>('about_project')
        const cookieRestaurant =
            cookies[RESTAURANT_COOKIE] !== undefined ? parseRestaurantCookie(cookies[RESTAURANT_COOKIE]) : null
        const restaurant = await getRestaurant(Number(cookieRestaurant?.id))
        const recommendedProductsAwait = getRecomendedProducts(cookies?.cart_id, restaurant?.id)
        const seoTitleAwait = getSeoTitle('about')
        const [page, recommendedProducts, seoTitles] = await Promise.all([
            getPageAwait,
            recommendedProductsAwait,
            seoTitleAwait,
        ])

        return {
            props: {
                content_page: page.content_page,
                recommendedProducts,
                seoTitles,
            },
        }
    } catch (error: any) {
        console.error(error)
        return {
            notFound: true,
        }
    }
}

export default About
