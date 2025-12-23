import {useEffect, useState} from 'react'
import {onScrollBottomReached} from '~/helpers'

export const useBottomDetector = (footerHeight: number) => {

    const [isBottomReached, setBottomReached] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (onScrollBottomReached(footerHeight)) {
                setBottomReached(true)
            } else {
                setBottomReached(false)
            }
        }

        if (window === undefined) {
            return
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [footerHeight])

    return isBottomReached
}
