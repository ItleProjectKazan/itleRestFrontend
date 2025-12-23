import React, { ReactNode, useCallback } from 'react'
import classNames from 'classnames'
import Link from 'next/link'

import { Loader } from '~/components'

import styles from './Button.module.scss'

type Props = {
    children: ReactNode
    className?: string
    color?: 'primary' | 'secondary'
    disableEnterPress?: boolean
    disabled?: boolean
    fullWidth?: boolean
    href?: string
    loading?: boolean
    onClick?: React.MouseEventHandler
    styleSecondary?: boolean
    size?: 'large' | 'medium' | 'small' | 'xlarge'
    variant?: 'contained' | 'outlined' | 'text'
}

export const Button = React.forwardRef<HTMLButtonElement, Props>(function Button(
    {
        children,
        className,
        color = 'primary',
        disableEnterPress,
        disabled,
        fullWidth = false,
        href = '',
        loading,
        onClick,
        variant = 'contained',
        size = 'medium',
    },
    ref,
) {
    const classes = classNames(styles.button, className, styles[size], styles[color], styles[variant], {
        [styles.disabled]: disabled,
        [styles.fullWidth]: fullWidth,
    })

    const handleClick = useCallback(
        (event: React.MouseEvent) => {
            if (!disabled && onClick !== undefined) {
                if (event.detail !== 0) {
                    onClick(event)
                } else {
                    if (disableEnterPress == undefined) {
                        onClick(event)
                    } else if (!disableEnterPress) {
                        onClick(event)
                    }
                }
            }
        },
        [disabled, onClick],
    )

    const linkComponent = useCallback(
        (props) => {
            return <Link href={href} {...props}></Link>
        },
        [href],
    )

    const Component = href ? linkComponent : 'button'

    return (
        <Component ref={ref} className={classes} disabled={disabled} onClick={handleClick}>
            {loading && <Loader white={variant === 'contained'} />}
            {!loading && children}
        </Component>
    )
})
