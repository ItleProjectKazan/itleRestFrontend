import React, { forwardRef } from 'react'
import classNames from 'classnames'
import InputMask from 'react-input-mask'
import cn from 'classnames'
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
    label?: string
}

const PhoneInput = forwardRef<HTMLInputElement, Props>(
    (
        {
            className,
            disabled,
            error,
            fullWidth,
            innerControl,
            subLine,
            showLabel,
            placeholder,
            labelClassName,
            label,
            ...props
        },
        ref,
    ) => {
        const input = (
            <div className={cn({ [styles.error]: error })}>
                {label ? <label htmlFor=''>{label}</label> : null}
                <InputMask
                    ref={ref}
                    alwaysShowMask
                    className={cn(styles.input, {
                        [styles.disabled]: disabled,
                        [styles.error]: error,
                        [styles.fullWidth]: fullWidth,
                    })}
                    disabled={disabled}
                    formatChars={{
                        '*': '[0-9]',
                    }}
                    mask='+7 (***) *** - ** - **'
                    maskChar='_'
                    {...props}
                />
            </div>
        )

        return (
            <div
                className={classNames('text-input', className, {
                    [styles.inputGroup]: innerControl !== undefined,
                    [styles.inputWrap]: innerControl === undefined,
                    [styles.higherInput]: showLabel,
                    [styles.error]: error,
                })}
            >
                {showLabel && <div className={labelClassName ? labelClassName : styles.higherLabel}>{placeholder}</div>}
                {input}
                {innerControl !== undefined && <div className={styles.innerControl}>{innerControl}</div>}
                {subLine !== undefined && <div className={styles.subLine}>{subLine}</div>}
            </div>
        )
    },
)

PhoneInput.displayName = 'PhoneInput'

export { PhoneInput }
