import React, { forwardRef } from 'react'
import classNames from 'classnames'

import styles from './TextAreaInput.module.scss'

type Props = {
    className?: string
    label?: string
    disabled?: boolean
    error?: boolean
    fullWidth?: boolean
    innerControl?: React.ReactChild
    subLine?: React.ReactChild
    [key: string]: any
}

const TextAreaInput = forwardRef<HTMLTextAreaElement, Props>(
    ({ className, disabled, error, fullWidth, innerControl, label, subLine, ...props }, ref) => {
        const input = (
            <textarea
                ref={ref}
                className={classNames(styles.input, {
                    [styles.disabled]: disabled,
                    [styles.error]: error,
                    [styles.fullWidth]: fullWidth,
                })}
                disabled={disabled}
                {...props}
            />
        )

        return (
            <div>
                {label && <div className="textarea-label">{label}</div>}
                <div
                    className={classNames('text-input', className, {
                        [styles.inputGroup]: innerControl !== undefined,
                        [styles.inputWrap]: innerControl === undefined,
                    })}
                >
                    {input}
                    {innerControl !== undefined && <div className={styles.innerControl}>{innerControl}</div>}
                    {subLine !== undefined && <div className={styles.subLine}>{subLine}</div>}
                </div>
            </div>
        )
    },
)

TextAreaInput.displayName = 'TextInput'

export { TextAreaInput }
