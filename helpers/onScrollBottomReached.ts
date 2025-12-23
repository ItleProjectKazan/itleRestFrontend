import { breakpoints } from '~/constants/breakpoints'

export function onScrollBottomReached(footerHeight?: number) {

    if (window === undefined) {
        return
    }

    const targetFooterHeight = footerHeight || 130
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight

    const body = document.body
    const html = document.documentElement

    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
    const windowBottom = windowHeight + window.pageYOffset + targetFooterHeight

    return window.innerWidth < breakpoints.phoneLarge && windowBottom >= docHeight
}
