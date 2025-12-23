import { memo } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface IFirstBlock {
    title: string
    date: string
    description: string
}

const FirstBlock = ({ title, date, description }: IFirstBlock) => {
    return (
        <div className='main-info'>
            <h1 className='main-info__title section-title'>{title}</h1>
            <span className='main-info__date d-flex'>
                {format(new Date(date), 'dd MMMM', {
                    locale: ru,
                })}
            </span>
            <div className='main-info__description'>
                <p
                    dangerouslySetInnerHTML={{
                        __html: description,
                    }}
                ></p>
            </div>
        </div>
    )
}

export default memo(FirstBlock)
