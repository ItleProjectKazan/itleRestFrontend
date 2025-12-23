import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import Router from 'next/router'
import { observer } from 'mobx-react-lite'
import classNames from 'classnames'
import { useCart, useStore, useBottomDetector } from '~/hooks'
import { getDefaultSelectedModifiers } from '~/helpers/product'
import { Button, Loader, ProductsSlider, Radiobox, Tooltip, Typography } from '~/components'
import { Footer } from './Footer/Footer'
import { CartItem } from '~/views/cart/CartItem/CartItem'
import { EmptyResult } from './Result/EmptyResult'
import { Total } from './Total/Total'
import { FreeDeliveryInformer } from './Location/FreeDeliveryInformer/FreeDeliveryInformer'
import { TProduct } from '~/types/catalog'
import { TCartItem } from '~/types/cart'
import { TOrderType } from '~/types/order'
import { TDeliveryZone } from '~/types/misc'
import { PageLinks } from '~/constants/pageLinks'
import styles from './Cart.module.scss'
import { addYm } from '~/helpers'
// import { parseRestaurantCookie } from '~/helpers'
// import { GetServerSideProps } from 'next'
// import { ApiEndpoints } from '~/constants/apiEndpoints'
// import { RESTAURANT_COOKIE } from '~/constants/misc'

interface ICartModalContent {
    recommendedProducts: TProduct[]
}

export const CartModalContent: FC<ICartModalContent> = observer(({ recommendedProducts }: ICartModalContent) => {
    const [redirectToCheckout, setRedirectToCheckout] = useState(false)
    const bottomIsReached = useBottomDetector(180)
    const [orderButtonDisabled, setOrderButtonDisabled] = useState(false)
    const [showMinOrderSumTooltip, setShowMinOrderSumTooltipTooltip] = useState(false)
    const [orderButtonRef, setOrderButtonRef] = useState<HTMLElement | null>(null)

    const [isMovingFurther, setMovingFurther] = useState(false)

    const cart = useCart()
    const { loginModal, user, orderParams, restaurantSelectModal, cartModal } = useStore()

    const minOrderPrice = cart.deliveryZone?.min_delivery_price ?? 0
    const freeDeliveryPrice = cart.deliveryZone?.free_delivery_price ?? 0

    useEffect(() => {
        if (cart.subtotalPrice >= minOrderPrice) {
            setOrderButtonDisabled(false)
        }
    }, [cart.subtotalPrice, minOrderPrice])

    useEffect(() => {
        if (showMinOrderSumTooltip) {
            const timeoutId = setTimeout(() => setShowMinOrderSumTooltipTooltip(false), 10000)
            return () => clearTimeout(timeoutId)
        }
    }, [showMinOrderSumTooltip])

    useEffect(() => {
        setShowMinOrderSumTooltipTooltip(false)
    }, [cart.totalQuantity])

    // redirect when a user was authenticated
    useEffect(() => {
        if (redirectToCheckout && user !== null) {
            cartModal.close()
            Router.push(PageLinks.CHECKOUT)
        } else {
            if (!loginModal.isOpen) {
                setMovingFurther(false)
            }
        }
    }, [redirectToCheckout, user, loginModal.isOpen])

    const handleRecommendedProductClick = useCallback(
        (product: TProduct) => {
            const modifiers = getDefaultSelectedModifiers(product)
            addYm('reachGoal', 'add')
            cart.add({
                productId: product.id,
                modifiers,
            })
        },
        [cart],
    )

    const handleUpdateItemQuantity = (item: TCartItem) => (quantity: number) => {
        addYm('reachGoal', 'add')
        cart.updateItem({
            itemId: item.id,
            modifiers: item.modifiers,
            quantity,
        })
    }

    const handleRemoveItem = (itemId: number) => () => {
        cart.removeItem(itemId)
    }

    const handleGoToCheckoutClick = () => {
        setMovingFurther(true)

        if (orderParams.orderType === TOrderType.DELIVERY && cart.subtotalPrice < minOrderPrice) {
            setShowMinOrderSumTooltipTooltip(true)
            setMovingFurther(false)

            return
        }

        if (user === null) {
            setRedirectToCheckout(true)
            loginModal.open('Подтвердите свой номер', 'Это поможет быстрее оформить заказ')
            return
        }

        Router.push(PageLinks.CHECKOUT)
        cartModal.close()
    }

    const productHeader = useMemo(() => {
        const lastNumber = cart.totalQuantity % 10
        if (lastNumber === 1) {
            return 'товар'
        }
        if ([2, 3, 4].includes(lastNumber)) {
            return 'товара'
        }
        return 'товаров'
    }, [cart.totalQuantity])

    const [delivery, setDelivery] = useState<boolean>(true)
    const [pickup, setPickup] = useState<boolean>(orderParams.orderType === TOrderType.PICKUP)

    const orderTypeOnChangeToDeliveryHandler = useCallback(() => {
        restaurantSelectModal.open(TOrderType.PICKUP)
    }, [restaurantSelectModal])

    const orderTypeOnChangeToPickupHandler = useCallback(() => {
        restaurantSelectModal.open(TOrderType.DELIVERY)
    }, [restaurantSelectModal])

    useEffect(() => {
        setDelivery(orderParams.orderType === TOrderType.DELIVERY)
        setPickup(orderParams.orderType === TOrderType.PICKUP)
    }, [orderParams.orderType])

    return (
        <div className={styles.content}>
            {showMinOrderSumTooltip && orderButtonRef !== null && (
                <Tooltip anchorEl={orderButtonRef} className={styles.minOrderSumTooltip} placement='top-end'>
                    <Typography weight='semi-bold'>
                        Минимальная сумма заказа для доставки <b>{minOrderPrice} руб.</b>
                    </Typography>
                    <Typography weight='semi-bold'>
                        Доставка бесплатная от <b>{freeDeliveryPrice} руб!</b>
                    </Typography>
                    <Typography weight='semi-bold'>Добавьте больше вкусной еды!</Typography>
                </Tooltip>
            )}
            <div>
                <div className={styles.cartTitle}>Моя корзина</div>
                {!cart.isEmpty && (
                    <div className={styles.totalHeader}>
                        {cart.totalQuantity} {productHeader} на {cart.totalPrice.toLocaleString()}₽
                    </div>
                )}

                <FreeDeliveryInformer />
                <div className='mh-50 mv-tablet-0'>
                    {cart.fetchingStatus === 'loading' && (
                        <div className='d-flex justify-content-center align-items-center'>
                            <Loader />
                        </div>
                    )}
                    {cart.fetchingStatus === 'success' && cart.isEmpty && <EmptyResult />}
                    {!cart.isEmpty && (
                        <ul className={styles.cardItemsList}>
                            {cart.items.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onRemove={handleRemoveItem(item.id)}
                                    onUpdateQuantity={handleUpdateItemQuantity(item)}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            {recommendedProducts.length > 0 && (
                <ProductsSlider
                    autoplay={false}
                    hideProductsWithModifiers
                    onProductClick={handleRecommendedProductClick}
                    products={recommendedProducts || []}
                    title='Добавить к заказу?'
                    titleClassName={styles.recommendedHeader}
                />
            )}
            {!cart.isEmpty && (
                <>
                    <div className={styles.cartDelivery}>
                        <Radiobox value={delivery} label='Доставка' onChange={orderTypeOnChangeToPickupHandler} />
                        <Radiobox value={pickup} label='Самовывоз' onChange={orderTypeOnChangeToDeliveryHandler} />
                    </div>
                    <div className={styles.totalsSection}>
                        <div className='d-flex align-items-center' style={{ width: '100%' }}>
                            <Total
                                bonus_received={cart?.bonus_received}
                                bonus_used={cart?.bonus_used}
                                deliveryZone={cart.deliveryZone as TDeliveryZone}
                                page='cart'
                                promocode={cart?.promocode}
                                subtotalPrice={cart.subtotalPrice}
                                totalPrice={cart.totalPrice}
                                productsCount={cart.items.length}
                            />
                        </div>
                    </div>
                    <Footer
                        actionComponent={
                            <Button
                                ref={setOrderButtonRef}
                                className={classNames(styles.orderButton, { [styles.buttonBottom]: !bottomIsReached })}
                                disableEnterPress
                                disabled={cart.isEmpty || orderButtonDisabled}
                                fullWidth={bottomIsReached}
                                loading={isMovingFurther}
                                onClick={handleGoToCheckoutClick}
                                size='large'
                            >
                                <span className={styles.partialButtonText}>Оформить заказ</span>
                            </Button>
                        }
                        backToCatalog
                        className={classNames({ [styles.footerBottom]: bottomIsReached })}
                    />
                </>
            )}
        </div>
    )
})
