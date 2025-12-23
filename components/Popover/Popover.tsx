import React, { FC, ReactNode, useState } from 'react'
import { usePopper } from 'react-popper'
import { Placement } from '@popperjs/core/lib/enums'
import classNames from 'classnames'

import styles from './Popover.module.scss'

interface Props {
    anchorEl: any
    children: ReactNode
    className?: string
    placement?: Placement
}

const Popover: FC<Props> = ({
    anchorEl,
    children,
    className,
    placement= 'bottom-start',
}) => {
    const [popperEl, setPopperEl] = useState<any>(null)

    const {
        styles: popperStyles,
        attributes: popperAttributes,
    } = usePopper(anchorEl, popperEl, {
        placement: placement,
        modifiers: [
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
            ref={ setPopperEl }
            className={ classNames(styles.dropdown, className) }
            style={ popperStyles.popper }
            { ...popperAttributes.popper }
        >
            { children }
        </div>
    )
}

export { Popover }
