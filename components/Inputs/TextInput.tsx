import React, { forwardRef } from 'react'
import classNames from 'classnames'

import styles from './TextInput.module.scss'

type Props = {
    className?: string
    disabled?: boolean
    error?: boolean
    fullWidth?: boolean
    innerControl?: React.ReactChild
    subLine?: React.ReactChild
    [key: string]: any
    showLabel?: boolean
    placeholder?: string
    labelClassName?: string
}

const TextInput = forwardRef<HTMLInputElement, Props>(({
    className,
    disabled,
    error,
    fullWidth,
    innerControl,
    subLine,
    showLabel,
    placeholder,
    labelClassName,
    ...props
}, ref) => {
    const input = (
        <input
            ref={ref}
            className={classNames(styles.input,
                {
                    [styles.disabled]: disabled,
                    [styles.error]: error,
                    [styles.fullWidth]: fullWidth,
                }
            )}
            disabled={disabled}
            {...props}
        />
    )

    return (
        <div className={
            classNames('text-input', className, {
                [styles.inputGroup]: innerControl !== undefined,
                [styles.inputWrap]: innerControl === undefined,
                [styles.higherInput]: showLabel,
                [styles.error]: error,
            })}
        >
            {showLabel &&
                <div className={labelClassName ? labelClassName : styles.higherLabel}>
                    {placeholder}
                </div>
            }
            {input}
            {
                innerControl !== undefined &&
                <div className={styles.innerControl}>{innerControl}</div>
            }
            {
                subLine !== undefined &&
                <div className={styles.subLine}>{subLine}</div>
            }
        </div>
    )
})

TextInput.displayName = 'TextInput'

export { TextInput }
