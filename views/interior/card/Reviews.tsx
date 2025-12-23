import React, { useState } from 'react'
import Image from 'next/legacy/image'
import cn from 'classnames'

type TReview = 'ya' | '2gis'

const Reviews = () => {
    const [type, setType] = useState<TReview>('ya')

    const onClick = (r: TReview) => () => {
        setType(r)
    }
    return (
        <section className='section-page institution-reviews'>
            <div className='container'>
                <div className='institution-reviews__inner d-flex flex-wrap'>
                    <h2 className='institution-reviews__title section-title'>отзывы гостей</h2>
                </div>

                <div className='institution-reviews__tabs d-flex'>
                    <div
                        onClick={onClick('ya')}
                        className={cn('institution-reviews__tabs-item transition', { 'is-active': type === 'ya' })}
                    >
                        <Image width={150} height={50} src='/images/ya.svg' alt='yandex' />
                    </div>
                    <div
                        onClick={onClick('2gis')}
                        className={cn('institution-reviews__tabs-item transition', { 'is-active': type === '2gis' })}
                    >
                        <Image width={150} height={50} src='/images/2gis.svg' alt='yandex' />
                    </div>
                </div>

                <div className='institution-reviews__content'>
                    {type === 'ya' ? <>Отзывы яндекс</> : null}
                    {type === '2gis' ? <>Отзывы 2ГИС</> : null}
                </div>
            </div>
        </section>
    )
}

export default Reviews
