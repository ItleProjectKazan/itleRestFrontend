import React, { FC, useCallback, useState } from 'react'
import classNames from 'classnames'

import { formatPrice } from '~/helpers/formatters'
import { useCart } from '~/hooks'

import { TDeliveryZone } from '~/types/misc'
import { TOrderType } from '~/types/order'
import { TPromocode } from '~/types/cart'

import { BonusesPopper } from './../BonusesPopper/BonusesPopper'
import InfoIcon from '~/public/images/info-icon.svg'

import styles from './Total.module.scss'

type Props = {
    bonus_received: number | null
    bonus_used: number | null
    deliveryZone: TDeliveryZone
    page: string
    promocode: TPromocode | undefined
    subtotalPrice: number
    totalPrice: number
    productsCount: number
}

export const Total: FC<Props> = ({
    bonus_received,
    bonus_used,
    deliveryZone,
    page,
    promocode,
    subtotalPrice,
    totalPrice,
    productsCount,
}) => {
    const cart = useCart()

    const [infoIconRef, setInfoIconRef] = useState<HTMLElement | null>(null)
    const [bonusesInfoOpened, openBonusesInfo] = useState(false)

    const handleShowInfoClick = useCallback(() => {
        openBonusesInfo(value => ! value)
    }, [])

    const freeDeliveryPrice = deliveryZone?.free_delivery_price ?? 0
    const deliveryPrice = subtotalPrice >= freeDeliveryPrice ? 0 : (deliveryZone?.price ?? 0)
    const pickupDiscountTotal = promocode?.code == 'WEBSITE-PICKUP-DISCOUNT' ? subtotalPrice - totalPrice : 0
    const promocodeDiscount = pickupDiscountTotal > 0 ? 0 : subtotalPrice + deliveryPrice - totalPrice
    const hasDiscount = promocodeDiscount > 0 || pickupDiscountTotal > 0 || bonus_used !== null && bonus_used > 0

    if (subtotalPrice == 0) {
        return <div />
    }

    // const bonusesInformationBlock = (
    //     <>
    //         <div
    //             ref={ setInfoIconRef }
    //             className={ classNames(styles.infoIcon, {
    //                 [styles.infoIconOpen]: bonusesInfoOpened,
    //             }) }
    //         >
    //             <InfoIcon onClick={ handleShowInfoClick } />
    //         </div>
    //         { bonusesInfoOpened &&
    //             <BonusesPopper
    //                 anchorRef={ infoIconRef }
    //                 onClose={ () => openBonusesInfo(false) }
    //             />
    //         }
    //     </>
    // )

    return (
        <div className={ styles.totalsSection }>
            <div className={ styles.content }>
                <div className={ styles.totalRow }>
                    <span>Товары ({productsCount})</span><span className={ hasDiscount ? styles.strikedPrice : '' }>{ formatPrice(subtotalPrice) }</span>
                </div>

                {
                    cart.type === TOrderType.DELIVERY && subtotalPrice > 0 &&
                    <div className={ styles.totalRow }>
                        <span>Доставка по городу</span><span>{ deliveryPrice > 0 ? formatPrice(deliveryPrice) : 'Бесплатно' }</span>
                    </div>
                }

                {
                    bonus_used !== null && bonus_used > 0 &&
                    <div className={ styles.totalRow }>
                        <span className={ styles.discountText }>Скидка:</span><span className={ styles.discountText }>&minus;{ bonus_used } ₽</span>
                    </div>
                }

                {
                    promocodeDiscount > 0 && bonus_used == 0 ? (
                        <div className={ styles.totalRow }>
                            <span className={ styles.discountText }>Промокод { promocode?.code }:</span><span className={ styles.discountText }>&minus;{ formatPrice(promocodeDiscount) }</span>
                        </div>
                    ) : (
                        cart.type === TOrderType.PICKUP && pickupDiscountTotal > 0 && bonus_used == 0 ?
                            (
                                <div className={ styles.totalRow }>
                                    <span className={ styles.discountText }>Скидка:</span><span className={ styles.discountText }>&minus;{ promocode?.bonus_multiplier }%</span>
                                </div>
                            ) : false
                    )
                }


                {
                    bonus_received !== null && bonus_received > 0 &&
                    <div className={ styles.totalRow }>
                        <span>Бонусы</span><span>{ `${bonus_received} ₽` }</span>
                    </div>
                }


                { page == 'result' &&
                    <div className={ styles.totalRow }>
                        <span></span><span className={ styles.bonusesHow }>Баллы начисляются после выполнения заказа и его оплаты</span>
                    </div>
                }

                <div className={ styles.totalFinalRow }>
                    <span>Сумма заказа:</span><span className={ hasDiscount ? styles.discountedTotal : '' }>{ formatPrice(hasDiscount ? totalPrice : subtotalPrice + deliveryPrice) }</span>
                </div>
                { /*
                    bonus_used !== null && bonus_used > 0 &&
                    <Typography className={ styles.bonusesText }>
                        Потрачено:&nbsp;{ bonus_used } { numToTitle(bonus_used, ['бонусный балл', 'бонусных балла', 'бонусных баллов']) }
                    </Typography>
                */ }
            </div>
        </div>
    )
}
