import { useState, useEffect, useMemo } from 'react'

import { breakpoints } from '~/constants/breakpoints'

const mediaQueries = new Map()

type TBreakpoint = keyof typeof breakpoints
;(Object.keys(breakpoints) as TBreakpoint[]).map((key) => {
    mediaQueries.set(key, `(max-width: ${breakpoints[key]}px)`)
})

export const useMediaQuery = (
    query: TBreakpoint,
): {
    matches: boolean
    size: TBreakpoint
} => {
    if (typeof window !== 'object') {
        return {
            matches: false,
            size: 'desktop',
        }
    }

    const mediaQuery = mediaQueries.get(query)
    const mediaQueryList = window.matchMedia(mediaQuery)

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState({
        matches: mediaQueryList.matches,
        media: mediaQueryList.media,
    })

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const handler = (event: MediaQueryListEvent) =>
            setValue({
                matches: event.matches,
                media: event.media,
            })

        if ('addEventListener' in mediaQueryList) {
            mediaQueryList.addEventListener('change', handler)
        } else {
            ;(mediaQueryList as any).addListener(handler)
        }

        return () => {
            if ('removeEventListener' in mediaQueryList) {
                mediaQueryList.removeEventListener('change', handler)
            } else {
                ;(mediaQueryList as any).removeListener(handler)
            }
        }
    }, [mediaQueryList])

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const size = useMemo(() => {
        return (Object.keys(breakpoints) as TBreakpoint[]).find(
            (key) => `(max-width: ${breakpoints[key]}px)` === value.media,
        ) as TBreakpoint
    }, [value.media])

    return {
        matches: value.matches,
        size,
    }
}
