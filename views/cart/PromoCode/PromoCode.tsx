import React, { FC, useEffect, useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { CartService } from '~/services/cart/cartService'
import { SettingsService } from '~/services/settingsService'
import { useCart, usePrevious, useStore } from '~/hooks'
import { TCartResetPromocode, TCartAppendPromocode } from '~/services/cart/types'
import { Typography } from '~/components'
import styles from './PromoCode.module.scss'
import DiscountShape from '~/public/images/discount-shape.svg'
import { TSelectedRestaurantInfo } from '~/types/misc'
import { RESTAURANT_COOKIE } from '~/constants/misc'
import { Input } from '~/components/Inputs/Input'

const PROMOCODE_LENGTH = 1

type Props = {
    allowDiscounts: (type: string) => void
}

export const PromoCode: FC<Props> = observer(
    ({ allowDiscounts }: Props) => {
        const cart = useCart()
        const store = useStore()
        const { promocodeModal, orderParams, user } = store
        const [promocode, recordPromoCode] = useState(
            cart?.promocode?.code
                ? cart?.promocode?.code !== 'WEBSITE-PICKUP-DISCOUNT'
                    ? cart?.promocode?.code
                    : ''
                : '',
        )
        const [promocodeButtonDisabled, setPromocodeButtonDisabled] = useState(true)
        ///const [isAppendingPromocode, startAppendingPromocode] = useState(false)
        const [promocodeSuccess, setPromocodeSuccess] = useState(false)
        const [promocodeError, setPromocodeError] = useState('')
        const [promocodeModalShown, setPromocodeModalShown] = useState(false)
        // const prevOrderType = usePrevious(orderParams.orderType)
        const prevModal = usePrevious(promocodeModal.isOpen)

        useEffect(() => {
            if (prevModal == true && promocodeModal.isOpen !== prevModal && promocodeModal.result) {
                setPromocodeModalShown(true)
            }
        }, [prevModal, promocodeModal])

        useEffect(() => {
            if (promocode.length > PROMOCODE_LENGTH && promocodeButtonDisabled && !promocodeError) {
                setPromocodeButtonDisabled(false)
            } else if ((promocode.length <= PROMOCODE_LENGTH || promocodeError) && !promocodeButtonDisabled) {
                setPromocodeButtonDisabled(true)
            }
        }, [promocode, promocodeError, promocodeButtonDisabled, setPromocodeButtonDisabled])

        const getAppendingErrorMessage = useCallback((error: any): string => {
            const errorMessage = ['Ошибка']

            if (error.response?.data?.validation_errors?.promocodes !== undefined) {
                errorMessage.push(': ' + error.response?.data?.validation_errors?.promocodes)
            }

            if (error.response?.data?.validation_errors?.code !== undefined) {
                errorMessage.push(': ' + error.response?.data?.validation_errors?.code)
            }
            return errorMessage.join('\n')
        }, [])

        const appendPromocode = async () => {
            if (promocode.length <= PROMOCODE_LENGTH) {
                return
            }
            if (!promocodeModalShown) {
                if (cart.bonus_max > 0 && user !== null) {
                    promocodeModal.open(promocode)
                    return
                }
            }

            ///startAppendingPromocode(true)
            const cartId = cart.id
            const locationStr = SettingsService.get(RESTAURANT_COOKIE)
            if (locationStr === null) {
                return
            }
            const restaurant = JSON.parse(locationStr) as TSelectedRestaurantInfo

            try {
                const result = await CartService.appendPromocode({
                    cart_id: cartId,
                    type: orderParams.orderType,
                    restaurant_id: restaurant.id,
                    code: promocode,
                } as TCartAppendPromocode)
                if (result && result.status < 300) {
                    setPromocodeError('')
                    setPromocodeSuccess(true)
                    ///startAppendingPromocode(false)
                    allowDiscounts('code')
                    cart.update()
                }
            } catch (error: any) {
                ///startAppendingPromocode(false)
                setPromocodeSuccess(false)
                setPromocodeError(getAppendingErrorMessage(error))
                allowDiscounts('')
            }
        }

        const resetPromocode = async () => {
            const cartId = cart.id
            try {
                await CartService.resetPromocode({
                    cart_id: cartId,
                    type: orderParams.orderType,
                } as TCartResetPromocode)

                allowDiscounts('')
                cart.update()
                // eslint-disable-next-line no-empty
            } catch (error: any) {
                console.error(error)
            }

            setPromocodeSuccess(false)
            setPromocodeError('')
        }

        const prevPromocode = usePrevious(cart?.promocode)
        useEffect(() => {
            if (!!prevPromocode && !cart?.promocode) {
                setPromocodeSuccess(false)
            } else if (cart?.promocode) {
                setPromocodeSuccess(true)
            }
        }, [cart?.promocode, prevPromocode])
        const prevModalShown = usePrevious(promocodeModalShown)
        useEffect(() => {
            if (prevModalShown !== promocodeModalShown && promocodeModal.result && !cart?.promocode?.code) {
                appendPromocode()
            }
        }, [promocodeModal.result, prevModalShown, promocodeModalShown])

        const freeDeliveryPrice = cart.deliveryZone?.free_delivery_price ?? 0
        const deliveryPrice = cart.subtotalPrice >= freeDeliveryPrice ? 0 : (cart.deliveryZone?.price ?? 0)
        const pickupDiscountTotal =
            cart.promocode?.code == 'WEBSITE-PICKUP-DISCOUNT' ? cart.subtotalPrice - cart.totalPrice : 0
        const promocodeDiscount = pickupDiscountTotal > 0 ? 0 : cart.subtotalPrice + deliveryPrice - cart.totalPrice

        return (
            <div className={styles.block}>
                <div className={styles.blockHeader}>
                    <div>Промокод</div>
                </div>
                <div className={styles.blockContent}>
                    <Input
                        label='Введите ваш промокод'
                        value={promocode}
                        width='big'
                        isWithEvent={true}
                        onChange={(value) => recordPromoCode(value)}
                        eventAction={promocodeSuccess ? resetPromocode : appendPromocode}
                        buttonLabel={promocodeSuccess ? 'Отменить' : 'Применить'}
                    />
                    {promocodeError.length == 0 && promocodeSuccess && !!cart.promocode && (
                        <div className={styles.info}>
                            <div className={styles.infoIcon}>
                                <DiscountShape />
                            </div>
                            <div className={styles.infoMain}>
                                {cart?.promocode?.type === 'gift' ? (
                                    <div className={styles.infoMainLabel}>Подарок по промокоду</div>
                                ) : (
                                    <>
                                        <div className={styles.infoMainHeader}>Ваша скидка по промокоду</div>
                                        <div className={styles.infoMainLabel}>
                                            Применили скидку {promocodeDiscount} ₽
                                        </div>
                                    </>
                                )}
                            </div>
                            {/* <div className={styles.infoBtn}>
                                <CloseIcon />
                            </div> */}
                        </div>
                    )}

                    {promocodeError.length && !promocodeSuccess ? (
                        <Typography className={styles.errorMessage}>{promocodeError}</Typography>
                    ) : (
                        false
                    )}
                </div>
            </div>
        )
    },
    { forwardRef: true },
)
