import { FC, useMemo, useState } from 'react'
import { usePopper } from 'react-popper'

import { useOnClickOutside } from '~/hooks'
import { foodValueProperties, foodValuePropertyKeys, TFoodValueProperty, propertyNotEmpty } from './foodValueProperties'

import { TProduct } from '~/types/catalog'

import styles from './FoodValue.module.scss'

interface Props {
    anchorRef: HTMLElement | null
    onClose: () => void
    product: TProduct
}

const FoodValueInfo: FC<Props> = ({
    anchorRef,
    onClose,
    product,
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

    const getValue = (key: TFoodValueProperty) => {
        if (propertyNotEmpty(product[key])) {
            const value = product[key].toFixed(2)

            return `${ value } ${ foodValueProperties[key].unit }`
        }

        return '-'
    }

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
                {
                    foodValuePropertyKeys.map(key => (
                        <div key={ key } className={ styles.row }>
                            <span>{ foodValueProperties[key].label }</span>
                            <span>{ getValue(key) }</span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export { FoodValueInfo }
