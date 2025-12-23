import React, { FC, ElementType, DOMAttributes } from 'react'
import classNames from 'classnames'

import styles from './Typography.module.scss'

interface Props extends DOMAttributes<any> {
    align?: 'start' | 'center' | 'end'
    className?: string
    color?: 'brown' | 'black' | 'error' | 'primary' | 'secondary' | 'secondary-light' | 'white'
    element?: ElementType
    lineHeight?: number
    noWrap?: boolean
    size?: number
    weight?: 'normal' | 'semi-bold' | 'bold'
}

const Typography: FC<Props> = ({
    align,
    children,
    className,
    color,
    element = 'div',
    lineHeight,
    noWrap,
    size,
    weight = 'bold',
    ...props
}) => {
    const classes = classNames(
        styles.typography,
        className,
        {
            [styles.colorError]: color === 'error',
            [styles.colorPrimary]: color === 'primary',
            [styles.colorSecondary]: color === 'secondary',
            [styles.colorSecondaryLight]: color === 'secondary-light',
            [styles.colorBrown]: color === 'brown',
            [styles.colorWhite]: color === 'white',
            [styles.alignStart]: align === 'start',
            [styles.alignCenter]: align === 'center',
            [styles.alignEnd]: align === 'end',
            [styles.noWrap]: noWrap,
            [styles.weightBold]: weight === 'bold',
            [styles.weightSemiBold]: weight === 'semi-bold',
            [styles.weightNormal]: weight === 'normal',
        },
    )

    const Component = element

    return (
        <Component
            className={ classes }
            style={{
                fontSize: size,
                lineHeight: lineHeight !== undefined ? `${ lineHeight }px` : undefined,
            }}
            { ...props }
        >
            { children }
        </Component>
    )
}

export { Typography }
