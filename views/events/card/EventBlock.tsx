import { memo } from 'react'
import SliderBlock from './SliderBlock'
import TextBlock from './TextBlock'
import DedicatedBlock from './DedicatedBlock'
import { TNewsItem } from '~/types/pages/news'
import { removeTags } from '~/helpers/removeTags'

interface IEventBlock {
    block: TNewsItem
}

const EventBlock = ({ block }: IEventBlock) => {
    const res = [<></>]
    if (block?.slider?.length) {
        res.push(<SliderBlock id={new Date().getTime()} slider={block.slider} />)
    }
    if (removeTags(block?.text) || removeTags(block?.title)) {
        res.push(<TextBlock text={block?.text || ''} title={block?.title || ''} />)
    }
    if (removeTags(block?.title_with_background) || removeTags(block?.text_with_background)) {
        res.push(<DedicatedBlock title={block?.title_with_background || ''} text={block?.text_with_background || ''} />)
    }

    return <>{res}</>
}

export default memo(EventBlock)
