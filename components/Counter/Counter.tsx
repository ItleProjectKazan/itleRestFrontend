import { forwardRef, useEffect, useState } from 'react'
import classNames from 'classnames'

import { Typography } from '~/components'

import MinusIcon from '~/public/images/minus-icon.svg'
import PlusIcon from '~/public/images/plus-icon.svg'

import styles from './Counter.module.scss'

type Props = {
    defaultValue?: number
    disableDecrement?: boolean
    disableIncrement?: boolean
    input?: boolean
    onChange: (value: number) => void
    max?: number
    min?: number
    value?: number
    className?: string
}

const Counter = forwardRef<any, Props>(({
    defaultValue = null,
    disableDecrement = false,
    disableIncrement = false,
    input = false,
    onChange,
    max: maxProp,
    min: minProp,
    value: valueProp,
    className,
}, ref) => {
    const [value, setValue] = useState(defaultValue !== null ? defaultValue : 1)

    useEffect(() => {
        if (valueProp !== undefined && value !== valueProp) {
            setValue(valueProp)
        }
    }, [value, valueProp])

    const handleChange = (step: number) => {
        const newValue = value + step
        const min = minProp ?? 0
        const max = maxProp ?? Infinity

        if (newValue >= min && newValue <= max) {
            if (valueProp === undefined) {
                setValue(newValue)
            }

            onChange(newValue)
        }
    }

    const handleInput = (amount: number) => {
        const newValue = amount
        const min = minProp ?? 0
        const max = maxProp ?? Infinity

        if (newValue >= min && newValue <= max) {
            if (valueProp === undefined) {
                setValue(newValue)
            }

            onChange(newValue)
        } else if (newValue < min) {
            if (valueProp === undefined) {
                setValue(1)
            }

            onChange(1)
        } else if (newValue > max) {
            if (valueProp === undefined) {
                setValue(max)
            }

            onChange(max)
        }
    }

    return (
        <div ref={ ref } className={ classNames(styles.counter, 'd-flex align-items-center', className) }>
            <button
                className={ classNames(styles.button, {
                    [styles.buttonDisabled]: disableDecrement,
                }) }
                onClick={ ! disableDecrement ? () => handleChange(- 1) : undefined }
                type="button"
            >
                <MinusIcon
                    className={ styles.minus_icon }
                    height="16"
                    width="16"
                />
            </button>
            {
                input ? (
                    <input
                        className={ classNames(styles.input) }
                        inputMode="numeric"
                        onChange={ (input) => handleInput(parseInt(input.target.value)) }
                        pattern="[0-9]*"
                        step={ 1 }
                        type="number"
                        value={ value }
                    />
                ) : (
                    <Typography className={ styles.count }>{ value }</Typography>
                )
            }
            <button
                className={ classNames(styles.button, {
                    [styles.buttonDisabled]: disableIncrement,
                }) }
                onClick={ ! disableIncrement ? () => handleChange(1) : undefined }
                type="button"
            >
                <PlusIcon
                    className={ styles.plus_icon }
                    height="16"
                    width="16"
                />
            </button>
        </div>
    )
})

Counter.displayName = 'Counter'

export { Counter }
