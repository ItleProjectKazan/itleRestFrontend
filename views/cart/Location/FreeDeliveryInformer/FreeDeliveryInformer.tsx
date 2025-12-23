import React, { useMemo } from 'react'
import { observer } from 'mobx-react-lite'

import { TOrderType } from '~/types/order'

import { useCart } from '~/hooks'

import DishOnMove from '~/public/images/DishOnMove.svg'

import styles from './FreeDeliveryInformer.module.scss'

export const FreeDeliveryInformer = observer(() => {

    const cart = useCart()

    const leftSum = useMemo(() => {
        if (cart.type == TOrderType.DELIVERY) {
            const freeDeliveryPrice = cart.deliveryZone?.free_delivery_price ?? 0
            const deliveryPrice = cart.subtotalPrice >= freeDeliveryPrice ? 0 : (cart.deliveryZone?.price ?? 0)

            if (deliveryPrice > 0) {
                return Math.round(freeDeliveryPrice - cart.subtotalPrice)
            }
        }

        return 0
    }, [cart])

    return (
        leftSum > 0 && cart.subtotalPrice > 0 ? (
            <div className={ styles.informerHolder }>
                <DishOnMove /> До бесплатной доставки осталось <span>{ leftSum } руб</span>
            </div>
        ) : null
    )
})
