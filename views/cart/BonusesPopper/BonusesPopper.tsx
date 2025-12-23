import { FC, useMemo, useState } from 'react'
import { usePopper } from 'react-popper'

import { useOnClickOutside } from '~/hooks'

import styles from './BonusesPopper.module.scss'

interface Props {
    anchorRef: HTMLElement | null
    onClose: () => void
}

const BonusesPopper: FC<Props> = ({
    anchorRef,
    onClose,
}) => {
    const [popupRef, setPopupRef] = useState<HTMLElement | null>(null)
    const [arrowRef, setArrowRef] = useState<HTMLElement | null>(null)

    useOnClickOutside(useMemo(() => ({
        current: popupRef,
    }), [popupRef]), onClose)

    const {
        styles: popperStyles,
        attributes: popperAttributes,
    } = usePopper(anchorRef, popupRef, {
        placement: 'bottom-end',
        modifiers: [
            {
                name: 'arrow',
                options: {
                    element: arrowRef,
                },
            },
            {
                name: 'offset',
                options: {
                    offset: [20, 15],
                },
            },
        ],
    })

    return (
        <div
            ref={ setPopupRef }
            className={ styles.container }
            style={ popperStyles.popper }
            { ...popperAttributes.popper }
        >
            <div
                ref={ setArrowRef }
                className={ styles.arrow }
                style={ popperStyles.arrow }
            />

            <div className={ styles.block }>
                Получите кэшбек 5% на каждый заказ и оплатите ими до 30% следующего заказа
            </div>
        </div>
    )
}

export { BonusesPopper }
