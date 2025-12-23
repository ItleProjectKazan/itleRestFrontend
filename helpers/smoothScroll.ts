import { MouseEvent, MouseEventHandler } from 'react'

const smoothDefaults = {
    duration: 750,
    offsetTop: 90,
    offsetLeft: 0,
}

/**
 * Обработчик нажатия на ссылку с href = блоку, к которому нужен подскролл (помеченному через id)
 *
 * Передача параметров через data-атрибуты:
 * data-duration        длительность анимации, в ms.
 * data-offset-top      отступ сверху, в px.
 * data-offset-left     отступ слева, в px.
 */
export const smoothScrollHandler: MouseEventHandler<HTMLAnchorElement> = (event: MouseEvent<HTMLAnchorElement>) => {
    if (typeof window.history.pushState !== 'function') {
        return true
    }

    event.preventDefault()
    const anchor = event.currentTarget as HTMLAnchorElement
    const hash = anchor.href.split('#')[1] || '#'
    window.history.pushState(null, '', '#' + hash)
    const targetElement = hash === '#' ? <HTMLElement>document.body : <HTMLElement>document.querySelector('#' + hash)
    if (! targetElement) {
        return true
    }

    const offsetTop = + (anchor.dataset['offsetTop'] ?? smoothDefaults.offsetTop)
    const offsetLeft = + (anchor.dataset['offsetLeft'] ?? smoothDefaults.offsetLeft)

    performSmoothScroll((targetElement.offsetTop || 0) - offsetTop,
        targetElement.offsetLeft || 0 - offsetLeft
    )
}

export const smoothScrollToElement = (targetElement: HTMLElement, props = {
    duration: smoothDefaults.duration,
    offsetTop: smoothDefaults.offsetTop,
    offsetLeft: smoothDefaults.offsetLeft,
}) => {
    if (! targetElement) {
        return
    }

    performSmoothScroll((targetElement.offsetTop || 0) - props.offsetTop,
        targetElement.offsetLeft || 0 - props.offsetLeft
    )
}

export const performSmoothScroll = (targetTop = 0, targetLeft = 0) => {
    if (typeof window !== 'undefined') {
        window.scroll({
            top: targetTop,
            left: targetLeft,
            behavior: 'smooth',
        })
    }
}
