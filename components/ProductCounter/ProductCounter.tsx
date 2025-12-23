import { forwardRef, useEffect, useState } from 'react'
import classNames from 'classnames'

import { Typography } from '~/components'

import MinusIcon from '~/public/images/minus-icon.svg'
import PlusIcon from '~/public/images/plus-icon.svg'

import styles from './ProductCounter.module.scss'

type Props = {
    disableDecrement?: boolean
    disableIncrement?: boolean
    onChange: (value: number) => void
    max?: number
    min?: number
    value?: number
}

const ProductCounter = forwardRef<any, Props>(({
    disableDecrement = false,
    disableIncrement = false,
    onChange,
    max: maxProp,
    min: minProp,
    value: valueProp,
}, ref) => {
    const [value, setValue] = useState(1)

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

    return (
        <div ref={ ref } className="product-card__counter-inner d-flex items-center">
            <button
                className={ classNames(styles.button, {
                    [styles.buttonDisabled]: disableDecrement,
                }) }
                onClick={ ! disableDecrement ? () => handleChange(- 1) : undefined }
                type="button"
                style={{background: '#2F2F2F'}}
            >
                <MinusIcon />
            </button>
            <Typography className={ styles.count }>{ value }</Typography>
            <button
                className={ classNames(styles.button, {
                    [styles.buttonDisabled]: disableIncrement,
                }) }
                onClick={ ! disableIncrement ? () => handleChange(1) : undefined }
                type="button"
                style={{background: '#C91100'}}
            >
                <PlusIcon />
            </button>
        </div>
    )
})

ProductCounter.displayName = 'Counter'

export { ProductCounter }
