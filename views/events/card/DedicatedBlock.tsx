import { memo } from 'react'
import { removeTags } from '~/helpers/removeTags'
interface IDedicatedBlock {
    title: string
    text: string
}
const DedicatedBlock = ({ text, title }: IDedicatedBlock) => (
    <div className='dedicated-block'>
        {removeTags(title) ? <h3 className='dedicated-block__title'>{title}</h3> : null}
        {removeTags(text) ? <div className='dedicated-block__text'>{text}</div> : null}
    </div>
)

export default memo(DedicatedBlock)
