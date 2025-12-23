import { FC, useMemo, useState } from 'react'
import { usePopper } from 'react-popper'

import { useOnClickOutside } from '~/hooks'

import styles from './DeliveryDateInfo.module.scss'

interface Props {
    anchorRef: HTMLElement | null
    date: string
    onClose: () => void
}

const DeliveryDateInfo: FC<Props> = ({
    anchorRef,
    date,
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
        placement: 'bottom',
        modifiers: [
            {
                name: 'arrow',
                options: {
                    element: arrowRef,
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
                Ваш заказ может быть обслужен начиная с <strong>{ date }</strong>
            </div>
        </div>
    )
}

export { DeliveryDateInfo }
