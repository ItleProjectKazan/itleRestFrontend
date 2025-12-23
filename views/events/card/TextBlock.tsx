import { memo } from 'react'

interface ITextBlock {
    title: string
    text: string
}

const TextBlock = ({ text, title }: ITextBlock) => (
    <div className='text-block'>
        <h2
            className='text-block__title'
            dangerouslySetInnerHTML={{
                __html: title,
            }}
        ></h2>
        <div
            className='text-block__description'
            dangerouslySetInnerHTML={{
                __html: text,
            }}
        ></div>
    </div>
)

export default memo(TextBlock)
