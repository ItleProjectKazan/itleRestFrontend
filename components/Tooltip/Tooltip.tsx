import React, { FC, useState } from 'react'
import { Placement } from '@popperjs/core/lib/enums'
import classNames from 'classnames'
import { usePopper } from 'react-popper'

import styles from './Tooltip.module.scss'

type Props = {
    anchorEl: any
    className?: string
    placement?: Placement
}

export const Tooltip: FC<Props> = ({
    anchorEl,
    className,
    children,
    placement,
}) => {
    const [tooltipRef, setTooltipRef] = useState<HTMLElement | null>(null)
    const [arrowRef, setArrowRef] = useState<HTMLElement | null>(null)

    const {
        styles: popperStyles,
        attributes: popperAttributes,
    } = usePopper(anchorEl, tooltipRef, {
        placement: placement,
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
                    offset: [0, 8],
                },
            },
        ],
    })

    return (
        <div
            ref={ setTooltipRef }
            className={ classNames(styles.tooltip, className) }
            style={ popperStyles.popper }
            { ...popperAttributes.popper }
        >
            <div
                ref={ setArrowRef }
                className={ styles.arrow }
                style={ popperStyles.arrow }
            />

            { children }
        </div>
    )
}
