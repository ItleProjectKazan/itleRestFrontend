import { FC, memo, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { TTripleSlider } from '~/types/triple_slider'
import { useQuery } from 'react-query'
import { getTripleSlider } from '~/services/queries'
import { QUERY_KEYS } from '~/views/home/constants'
import { Loader } from '~/components'

const AtmosphereComfort: FC = () => {
    const [loading, setLoading] = useState(true)

    const tripleSlider = useQuery<TTripleSlider>(QUERY_KEYS.TRIPLE_SLIDER(), () => getTripleSlider(), {
        refetchOnWindowFocus: false,
    }).data
    useEffect(() => {
        if (tripleSlider?.left) {
            setLoading(false)
        }
    }, [tripleSlider?.left])

    if (loading) {
        return (
            <div className='main-banner__slide loading'>
                <Loader />
            </div>
        )
    }

    return (
        <section className='section-page atmosphere-comfort'>
            <div className='container'>
                <div style={{ position: 'relative' }} className='atmosphere-comfort__inner d-flex justify-between'>
                    <h2 className='atmosphere-comfort__title'>
                        Атмосфера <br />
                        уюта <br />и комфорта
                    </h2>
                    <div className='atmosphere-comfort__slider atmosphere-comfort__slider--mob'>
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={10}
                            lazy
                            pagination={{
                                clickable: true,
                            }}
                            loop={true}
                        >
                            {tripleSlider?.left?.map(({ id, original_url }) => (
                                <SwiperSlide key={id}>
                                    <div
                                        className='atmosphere-comfort__slider-slide d-flex'
                                        style={{ backgroundImage: `url(${original_url})` }}
                                    ></div>
                                </SwiperSlide>
                            ))}
                            {tripleSlider?.right?.map(({ id, original_url }) => (
                                <SwiperSlide key={id}>
                                    <div
                                        className='atmosphere-comfort__slider-slide d-flex'
                                        style={{ backgroundImage: `url(${original_url})` }}
                                    ></div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <span className='atmosphere-comfort__description'>
                        Уютный интерьер, выполненный в природных текстурах камня и дерева, создает ощущение домашнего
                        очага для всей семьи. Открытая кухня позволяет наблюдать за приготовлением блюд. Основное меню
                        составляют мясные хиты кухонь стран мира. Для семей с детьми есть игровая зона и детское меню. А
                        для гостей, исповедующих ислам, предусмотрена комната для намаза.
                    </span>
                    {tripleSlider?.left?.length ? (
                        <div className='atmosphere-comfort__inner-buttons d-flex'>
                            <button
                                aria-label='next'
                                className='next-slide-atmosphere atmosphere-comfort__inner-btn circle-center transition'
                            >
                                <span className='icon-angle-left'></span>
                            </button>
                            <button
                                aria-label='prev'
                                className='prev-slide-atmosphere atmosphere-comfort__inner-btn circle-center transition'
                            >
                                <span className='icon-angle-right'></span>
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
            <div className='atmosphere-comfort__sliders d-flex'>
                <div className='atmosphere-comfort__slider'>
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={10}
                        navigation={{
                            prevEl: '.next-slide-atmosphere',
                            nextEl: '.prev-slide-atmosphere',
                        }}
                    >
                        {tripleSlider?.left?.map(({ id, original_url }) => (
                            <SwiperSlide key={id}>
                                <div
                                    className='atmosphere-comfort__slider-slide d-flex'
                                    style={{ backgroundImage: `url(${original_url})` }}
                                ></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className='atmosphere-comfort__slider'>
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={10}
                        navigation={{
                            prevEl: '.next-slide-atmosphere',
                            nextEl: '.prev-slide-atmosphere',
                        }}
                    >
                        {tripleSlider?.middle?.map(({ id, media }) => (
                            <SwiperSlide key={id}>
                                <div className='atmosphere-comfort__slider-slide d-flex'>
                                    <div className='slide-block d-flex flex-wrap justify-between'>
                                        {media.map(({ id, custom_properties, original_url }) =>
                                            custom_properties?.text ? (
                                                <div key={id} className='slide-block__item d-flex'>
                                                    <div className='slide-block__item-content d-flex flex-column'>
                                                        {custom_properties?.icon ? (
                                                            <img
                                                                src={custom_properties?.icon}
                                                                alt=''
                                                                className='slide-block__item-icon'
                                                            />
                                                        ) : null}
                                                        <span className='slide-block__item-text'>
                                                            {custom_properties.text}
                                                        </span>
                                                        {custom_properties?.link && (
                                                            <a
                                                                href={custom_properties.link}
                                                                className='slide-block__item-link d-flex items-center'
                                                            >
                                                                Подробнее
                                                                <span className='icon-angle-right'></span>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    key={id}
                                                    className='slide-block__item d-flex'
                                                    style={{
                                                        backgroundImage: `url(${original_url})`,
                                                    }}
                                                ></div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className='atmosphere-comfort__slider'>
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={10}
                        navigation={{
                            prevEl: '.next-slide-atmosphere',
                            nextEl: '.prev-slide-atmosphere',
                        }}
                    >
                        {tripleSlider?.right?.map(({ id, original_url }) => (
                            <SwiperSlide key={id}>
                                <div
                                    className='atmosphere-comfort__slider-slide d-flex'
                                    style={{ backgroundImage: `url(${original_url})` }}
                                ></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    )
}
export default memo(AtmosphereComfort)
