import React from 'react'
import classNames from 'classnames'

import { Typography } from '~/components'
import { formatPrice } from '~/helpers/formatters'

import styles from  './Price.module.scss'

type Props = {
    className?: string
    color: 'black' | 'primary' | 'secondary' | 'secondary-light'
    strikethrough?: boolean
    value: number
}

export const Price: React.FC<Props> = ({
    className,
    color,
    strikethrough = false,
    value,
}) => {

    return (
        <Typography
            className={ classNames(styles.price, className, {
                [styles.strikethrough]: strikethrough,
            }) }
            color={ color }
        >
            { formatPrice(value) }
        </Typography>
    )
}
