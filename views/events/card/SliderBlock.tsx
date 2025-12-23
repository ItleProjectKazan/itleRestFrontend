import { memo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

interface ISliderBlock {
    slider: string[]
    id: number
}

const SliderBlock = ({ slider, id }: ISliderBlock) => (
    <div className='event-slider'>
        <Swiper
            slidesPerView={1}
            spaceBetween={15}
            loop={false}
            navigation={{
                prevEl: `.prev-first-slide-event-${id}`,
                nextEl: `.next-first-slide-event-${id}`,
            }}
            pagination={{
                clickable: true,
            }}
        >
            {slider.map((item, index) => (
                <SwiperSlide key={index}>
                    <a href='' className='event-slider__slide d-flex'>
                        <img src={item} className='event-slider__slide-image' loading='lazy' alt='event slide image' />
                    </a>
                </SwiperSlide>
            ))}
        </Swiper>
        <button
            className={`prev-first-slide-event-${id} event-slider__btn event-slider__btn--prev circle-center transition`}
        >
            <span className='icon-angle-left'></span>
        </button>
        <button
            className={`next-first-slide-event-${id} event-slider__btn event-slider__btn--next circle-center transition`}
        >
            <span className='icon-angle-right'></span>
        </button>
    </div>
)

export default memo(SliderBlock)
