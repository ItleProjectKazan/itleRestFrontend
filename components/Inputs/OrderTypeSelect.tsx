import { FC } from 'react'
import classNames from 'classnames'

import { useStore } from '~/hooks'

import { DiamondLabel } from '~/components'

import { TOrderType } from '~/types/order'

import styles from './OrderTypeSelect.module.scss'

const options = [
    {
        type: TOrderType.DELIVERY,
        label: 'Доставка',
    },
    {
        type: TOrderType.PICKUP,
        label: 'Самовывоз',
    },
]

interface Props {
    className?: string
    onChange: (type: TOrderType) => void
    type: TOrderType
}

const OrderTypeSelect: FC<Props> = ({
    className,
    onChange,
    type,
}) => {
    const { environment } = useStore()

    return (
        <div className={ classNames(className, styles.select) }>
            {
                options.map(option => (
                    <div
                        key={ option.type }
                        className={ classNames(styles.option, {
                            [styles.optionSelected]: option.type === type,
                        }) }
                        onClick={ () => onChange(option.type) }
                    >
                        { option.label }

                        {
                            option.type === TOrderType.PICKUP &&
                            environment.pickup_discount > 0 &&
                            <div className={ styles.discountLabel }>
                                <DiamondLabel
                                    color="secondary"
                                    label={ `-${ environment.pickup_discount }%` }
                                    size={ 45 }
                                />
                            </div>
                        }
                    </div>
                ))
            }
        </div>
    )
}

export { OrderTypeSelect }
