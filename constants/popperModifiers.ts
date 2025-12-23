import { Modifier } from 'react-popper'

export const sameWidth: Modifier<'sameWidth', {}> = {
    name: 'sameWidth',
    enabled: true,
    phase: 'beforeWrite',
    requires: ['computeStyles'],
    fn: ({ state }) => {
        state.styles.popper.width = `${ state.rects.reference.width }px`
    },
    effect: ({ state }) => {
        state.elements.popper.style.width = `${
            // @ts-ignore
            state.elements.reference.offsetWidth
        }px`
    },
}
