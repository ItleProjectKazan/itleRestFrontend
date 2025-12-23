import { useEffect } from 'react'

export const useDisableBodyScroll = (disable: boolean = true) => {
    useEffect(() => {
        // do nothing if the scroll already disabled
        if (! disable || document.body.style.overflow === 'hidden') {
            return
        }

        const previousOverflowValue = document.body.style.overflow

        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow = previousOverflowValue
        }
    }, [disable])
}
