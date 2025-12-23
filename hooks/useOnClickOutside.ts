import { useEffect, RefObject} from 'react'

export function useOnClickOutside(ref: RefObject<any>, handler: (event: MouseEvent | TouchEvent) => void) {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (ref.current === null || ref.current.contains(event.target)) {
                return
            }

            handler(event)
        }

        const eventName = 'ontouchstart' in window ? 'touchstart' : 'mousedown'

        document.addEventListener(eventName, listener)

        return () => {
            document.removeEventListener(eventName, listener)
        }
    }, [ref, handler])
}
