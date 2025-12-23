/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-useless-escape */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Router, { useRouter } from 'next/router'
import type { NextPage } from 'next'
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import { useForm } from 'react-hook-form'
import { generatePath } from '~/helpers'
import { GetServerSideProps } from 'next'

import { smoothScrollToElement } from '~/helpers/smoothScroll'
import {
    useBottomDetector,
    useCart,
    useCloudPaymentsWidget,
    useCurrentLocality,
    useStore,
    useCurrentRestaurant,
    usePrevious,
} from '~/hooks'
import { CartService } from '~/services/cart'
import { OrdersService } from '~/services/ordersService/ordersService'
import { SettingsService } from '~/services/settingsService'

import { Button, Layout, Section, TextInput, Counter } from '~/components'
import { Payment } from '~/views/cart/Payment/Payment'
import { CartItem } from './CartItem/CartItem'
import { Location, LocationHandle } from './Location/Location'

import { Datetime } from './Datetime/Datetime'
import { BonusesRow } from './BonusesRow/BonusesRow'
import { PromoCode } from './PromoCode/PromoCode'
import { parseRestaurantCookie } from '~/helpers'

import { Total } from '~/views/cart/Total/Total'

import { TDeliveryZone, TSelectedRestaurantInfo } from '~/types/misc'
import { TProduct } from '~/types/catalog'
import { TCartItem } from '~/types/cart'
import { TOrderStep, TOrderType, TPaymentMethod } from '~/types/order'
import { TPlaceOrderRequest } from '~/services/ordersService/types'

import { RESTAURANT_COOKIE } from '~/constants/misc'
import { PageLinks } from '~/constants/pageLinks'

import styles from './Checkout.module.scss'
import stylesCart from './Cart.module.scss'
import { getRecomendedProducts } from '~/services/queries'
import { addYm } from '~/helpers'

import { postFrontendLog } from '~/services/queries'

// import ym from 'react-yandex-metrika'

interface Props {
    recommendedProducts: TProduct[]
}

const MAX_CUTLERY_QUANTITY = 15

type TErrorMesages = {
    name?: string
    email?: string
}

const Checkout: NextPage<Props> = observer(({ recommendedProducts = [] }) => {
    const cart = useCart()
    const store = useStore()
    const { orderParams, user } = store
    const router = useRouter()
    const locality = useCurrentLocality()
    const restaurant = useCurrentRestaurant()

    const [error, setError] = useState('')
    const [orderCreated, setOrderCreated] = useState(false)
    const [errorMessages, setErrorMessages] = useState<TErrorMesages>()
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)
    const [orderButtonDisabled, setOrderButtonDisabled] = useState(false)
    const [showMinOrderSumTooltip, setMinOrderSumTooltipTooltip] = useState(false)

    const supportPhoneNumber = locality?.support_phone_number ?? '(номер не укаазан)'

    const [delivery_date, setDeliveryDate] = useState<any>(false)
    const [delivery_time, setDeliveryTime] = useState<any>(false)

    const [availableDiscounts, allowDiscounts] = useState('')

    const prevRestaurant = usePrevious(restaurant)
    const prevOrderType = usePrevious(orderParams.orderType)

    useEffect(() => {
        if (
            restaurant !== prevRestaurant ||
            orderParams.orderType !== prevOrderType ||
            orderParams.paymentMethod == TPaymentMethod.CARD_ONLINE
        ) {
            if (
                restaurant !== null &&
                !restaurant.accepts_online_payments &&
                orderParams.paymentMethod == TPaymentMethod.CARD_ONLINE
            ) {
                orderParams.setPaymentMethod(TPaymentMethod.CASH)
            }
        }
    }, [restaurant, prevRestaurant, prevOrderType, orderParams.orderType, orderParams.paymentMethod])

    const prevPayment = usePrevious(orderParams.paymentMethod)
    useEffect(() => {
        if (prevPayment !== orderParams.paymentMethod && error.length) {
            setError('')
        }
    }, [error, prevPayment, orderParams.paymentMethod])

    useEffect(() => {
        addYm('reachGoal', 'checkout')
    }, [])

    useEffect(() => {
        if (cart?.promocode?.code && cart.subtotalPrice > (cart?.promocode?.order_sum || 0)) {
            allowDiscounts('code')
        } else {
            allowDiscounts('')
        }
    }, [cart?.promocode?.code])

    const getReplacements = (item: TCartItem) => async (): Promise<TProduct[]> => {
        if (cart.restaurantId === null) {
            return []
        }

        const { data } = await CartService.getReplacements({
            category_id: item.product.category_id,
            restaurant_id: cart.restaurantId,
        })

        return data
    }

    const {
        formState: { errors: formErrors },
        getFieldState,
        getValues,
        register: registerField,
        setValue: setFieldValue,
        trigger: triggerValidation,
    } = useForm({
        defaultValues: {
            customer_name: user?.name ?? '',
            customer_email: user?.email ?? '',
            cutlery_count: 0,
            customer_note: '',
            change: '',
        },
    })

    const [cutlery_count, setCutleryCount] = useState(() => {
        return getValues().cutlery_count
    })

    const formData = getValues()
    const fields: Record<keyof typeof formData, any> = {
        customer_name: registerField('customer_name', {
            pattern: /.{1,32}/,
            required: true,
            validate: (value) => value.length >= 1 && value.length <= 32 && value.replace(/\s/g, '').length >= 1,
        }),
        customer_email: registerField('customer_email', {
            pattern:
                /^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i,
        }),
        cutlery_count: registerField('cutlery_count'),
        customer_note: registerField('customer_note', {
            pattern: /.{0,100}/,
        }),
        change: registerField('change'),
        // change: registerField('change', {
        //     disabled: !needChange,
        //     pattern: /[0-9]{1,5}/,
        // }),
    }

    /// Reset change if change disabled
    // useEffect(() => {
    //     if (!needChange && formData.change !== '' && formData.change !== null) {
    //         setFieldValue('change', '')
    //     }
    // }, [needChange, formData, setFieldValue]

    const inputRefs = useRef<Record<keyof typeof formData, HTMLElement | null>>({
        customer_email: null,
        customer_name: null,
        cutlery_count: null,
        customer_note: null,
        change: null,
    })
    const locationRef = useRef<LocationHandle>(null)

    const cloudPayments = useCloudPaymentsWidget({
        language: 'ru-RU',
    })

    const minOrderPrice = cart.deliveryZone?.min_delivery_price ?? 0

    useEffect(() => {
        // if a user logged out or location is not selected then redirect to home page
        if (user === null || cart.isEmpty || orderParams.orderType === null || orderParams.restaurantId === null) {
            if (!orderCreated) {
                Router.push(PageLinks.HOME)
            }
        }
    }, [cart, orderCreated, orderParams, user])

    /// Show popper if minimal sum is not enough
    useEffect(() => {
        if (showMinOrderSumTooltip) {
            const timeoutId = setTimeout(() => setMinOrderSumTooltipTooltip(false), 10000)
            return () => clearTimeout(timeoutId)
        }
    }, [showMinOrderSumTooltip])

    const isOnBottom = useBottomDetector(130)

    const orderTotal = cart.totalPrice

    const scrollToError = () => {
        setTimeout(() => {
            const errorBlock = document.getElementById('error_block')
            if (errorBlock !== null) {
                smoothScrollToElement(errorBlock, { duration: 3000, offsetTop: 100, offsetLeft: 0 })
            }

            if (errorBlock !== null) {
                const errorItems = document.querySelectorAll('[data-error="true"]')

                if (errorItems.length) {
                    setTimeout(() => {
                        smoothScrollToElement(errorItems[0] as HTMLElement, {
                            duration: 3000,
                            offsetTop: 100,
                            offsetLeft: 0,
                        })
                    }, 800)
                }
            }
        }, 50)
    }

    const validateForms = async () => {
        return new Promise(async (resolve, reject) => {
            if (locationRef.current === null) {
                reject('Delivery ref is null.')

                return
            }

            await triggerValidation()

            if (orderParams.orderType === TOrderType.DELIVERY) {
                await locationRef.current.triggerFormValidation()
            }

            const invalidFieldRefs: HTMLElement[] = [
                ...(Object.keys(inputRefs.current)
                    .map((nameStr: any) => {
                        const name = nameStr as keyof typeof formData

                        return getFieldState(name).invalid ? inputRefs.current[name] : null
                    })
                    .filter((el) => el !== null) as HTMLElement[]),
                ...(locationRef.current.getInvalidFields() ?? []),
            ]

            // scroll to the first invalid field
            if (invalidFieldRefs.length > 0) {
                smoothScrollToElement(invalidFieldRefs[0], { duration: 3000, offsetTop: 100, offsetLeft: 0 })
            }

            resolve(invalidFieldRefs.length === 0)
        })
    }

    const revalidate = () => {
        return new Promise(async (resolve, reject) => {
            setErrorMessages({})
            if (locationRef.current === null) {
                reject('Delivery ref is null.')

                return
            }

            await triggerValidation()

            if (orderParams.orderType === TOrderType.DELIVERY) {
                await locationRef.current.triggerFormValidation()
            }

            const invalidFieldRefs: HTMLElement[] = [
                ...(Object.keys(inputRefs.current)
                    .map((nameStr: any) => {
                        const name = nameStr as keyof typeof formData

                        return getFieldState(name).invalid ? inputRefs.current[name] : null
                    })
                    .filter((el) => el !== null) as HTMLElement[]),
                ...(locationRef.current.getInvalidFields() ?? []),
            ]

            resolve(invalidFieldRefs.length === 0)
        })
    }

    useEffect(() => {
        revalidate()
    }, [orderParams.orderType, orderParams.deliveryDetails])

    useEffect(() => {
        if (orderButtonDisabled && cart.totalPrice >= minOrderPrice) {
            setOrderButtonDisabled(false)
        }
    }, [orderButtonDisabled, minOrderPrice, cart.totalPrice, error])

    const getPlacingErrorMessage = useCallback(
        (error: any): string => {
            const errorMessage = [
                `Что-то пошло не так. Пожалуйста, попробуйте повторно разместить свой заказ или позвоните по номеру ресторана: ${supportPhoneNumber}.`,
                `<b>Ошибка:</b> ${error}`,
            ]

            if (error.response?.status === 422) {
                const validationErrors = Object.keys(error.response.data.validation_errors).map((name) => {
                    return `<b>${name}:</b> ` + error.response.data.validation_errors[name].join(', ')
                })

                return [...errorMessage, ...validationErrors].join('\n')
            }

            if (error.response?.data?.message !== undefined) {
                errorMessage.push(error.response?.data?.message)
            }

            return errorMessage.join('\n')
        },
        [supportPhoneNumber],
    )

    const placeOrder = async () => {
        setError('')
        const orderId = cart.id

        if (user === null || orderId === null || locationRef.current === null) {
            return
        }

        if (cloudPayments === null) {
            setError('Оплата онлайн временно недоступна.')

            return
        }

        const hasUnavailableItems = cart.items.filter((item) => !item.is_available).length > 0

        if (hasUnavailableItems) {
            setError('Некоторые позиции заказа недоступны.')
            scrollToError()

            return
        }

        if (orderParams.orderType === TOrderType.DELIVERY && cart.subtotalPrice < minOrderPrice) {
            setError('Недостаточная сумма для оформления заказа. Минимальная сумм: ' + minOrderPrice)

            return
        }

        const locationStr = SettingsService.get(RESTAURANT_COOKIE)

        if (locationStr === null) {
            return
        }

        const restaurant = JSON.parse(locationStr) as TSelectedRestaurantInfo

        setIsPlacingOrder(true)

        // run validations
        const isValid = await validateForms()
        if (!isValid) {
            setIsPlacingOrder(false)
            const error: TErrorMesages = {}
            if (formErrors.customer_email !== undefined) {
                error['email'] = 'Введите корректный email'
            }
            if (formErrors.customer_name !== undefined) {
                error['name'] = 'Введите имя'
            }
            setErrorMessages(error)
            return
        }

        const formData = getValues()
        const locationFormData = locationRef.current.getFormData()

        const recordEcommerceData = (orderId: string, sum: number, items: TCartItem[]) => {
            if (typeof window.dataLayer !== 'undefined') {
                const products: any[] = []
                items.map((item) => {
                    products.push({
                        name: item.product.name,
                        price: item.total_price / item.quantity,
                        quantity: item.quantity,
                    })
                })
                window.dataLayer.push({
                    event: 'aevent',
                    acategory: 'ecommerce',
                    aaction: 'purchase',
                    ecommerce: {
                        purchase: {
                            actionField: {
                                id: orderId,
                                revenue: sum,
                            },
                            products: products,
                        },
                    },
                })
            }
        }

        const afterPayment = async () => {
            const data = {
                order_id: orderId,
                customer_name: formData.customer_name,
                receipt_email: formData.customer_email,
                customer_note: formData.customer_note,
                payment_method: orderParams.paymentMethod,
                type: orderParams.orderType,
                cutlery_count: formData.cutlery_count,
                scheduled_time:
                    delivery_date && delivery_time
                        ? delivery_time.asap
                            ? null
                            : delivery_date.value + ' ' + delivery_time.value + ':00'
                        : null,
                change: undefined /*needChange ? formData.change : undefined,*/,
                ...(orderParams.orderType === TOrderType.DELIVERY
                    ? {
                          locality: locationFormData.locality,
                          province: locationFormData.province,
                          street: locationFormData.street,
                          house: locationFormData.house,
                          apartment: locationFormData.apartment,
                          porch: locationFormData.porch,
                          floor: locationFormData.floor,
                          door_code: locationFormData.door_code,
                          latitude: restaurant.delivery_details?.coords.latitude ?? 0,
                          longitude: restaurant.delivery_details?.coords.longitude ?? 0,
                      }
                    : {}),
            } as TPlaceOrderRequest

            try {
                await OrdersService.place(data)
                postFrontendLog({ user, data })
            } catch (error: any) {
                setIsPlacingOrder(false)
                setError(getPlacingErrorMessage(error))
                scrollToError()

                if (error.response?.status === 422) {
                    throw error
                    return
                }

                throw error
            }

            recordEcommerceData(orderId, orderTotal, cart.items)

            setOrderCreated(true)
            CartService.clearId()
            await cart.createCart()
            store.fetchUser()

            setTimeout(function () {
                router.push(
                    generatePath(PageLinks.ORDER_STATUS, {
                        orderId: orderId,
                    }),
                )
            }, 400)
        }

        const startPayment = async () => {
            cloudPayments
                .pay({
                    restaurantId: restaurant.id,
                    amount: orderTotal,
                    autoClose: 3,
                    clientName: formData.customer_name,
                    clientPhone: user.phone_number,
                    description: 'Оплата заказа ' + cart.id,
                    onSuccess: afterPayment,
                    orderId: orderId,
                })
                .then(async (result) => {
                    if (!result.success) {
                        setIsPlacingOrder(false)
                        setError('Не удалось оплатить, попробуйте еще раз.')
                        scrollToError()

                        return
                    }
                })
                .catch(async (error: Error | string) => {
                    setIsPlacingOrder(false)
                    setError(
                        [
                            `Произошла ошибка оплаты, пожалуйста попробуйте снова или позвоните по телефону: ${supportPhoneNumber}.`,
                            `<b>Ошибка:</b> ${error}`,
                        ].join('\n'),
                    )
                    scrollToError()
                })
        }

        const beforePayment = async () => {
            try {
                await OrdersService.prevalidate({
                    order_id: orderId,
                    customer_name: formData.customer_name,
                    receipt_email: formData.customer_email,
                    customer_note: formData.customer_note,
                    payment_method: orderParams.paymentMethod,
                    cutlery_count: formData.cutlery_count,
                    scheduled_time:
                        delivery_date && delivery_time
                            ? delivery_time.asap
                                ? null
                                : delivery_date.value + ' ' + delivery_time.value + ':00'
                            : null,
                    change: undefined, //needChange ? formData.change : undefined,
                    ...(orderParams.orderType === TOrderType.DELIVERY
                        ? {
                              street: locationFormData.street,
                              house: locationFormData.house,
                              locality: locationFormData.locality,
                              province: locationFormData.province,
                              apartment: locationFormData.apartment,
                              porch: locationFormData.porch,
                              floor: locationFormData.floor,
                              door_code: locationFormData.door_code,
                              latitude: restaurant.delivery_details?.coords.latitude ?? 0,
                              longitude: restaurant.delivery_details?.coords.longitude ?? 0,
                          }
                        : {}),
                } as TPlaceOrderRequest)

                startPayment()
            } catch (error: any) {
                setIsPlacingOrder(false)
                setError(getPlacingErrorMessage(error))
                scrollToError()
            }
        }

        if (orderParams.paymentMethod !== TPaymentMethod.CARD_ONLINE) {
            afterPayment()

            return
        }

        beforePayment()
    }

    const showBonusesRow = useMemo(() => {
        if (cart.bonus_used > 0) {
            return true
        }
        if (cart.bonus_max > 0 && user !== null && availableDiscounts !== 'code') {
            return true
        }

        return false
    }, [availableDiscounts, cart, user])

    const showPromocode = useMemo(() => {
        const withGift = cart.items.some(({ item_type }) => item_type === 'gift')
        if (cart.bonus_used == 0 && (!withGift || (withGift && cart.promocode))) {
            return true
        }

        return false
    }, [cart])
    const updateCutleryCount = async (value: number) => {
        const locationStr = SettingsService.get(RESTAURANT_COOKIE)

        if (locationStr === null) {
            return
        }

        const restaurant = JSON.parse(locationStr) as TSelectedRestaurantInfo
        const locationFormData = locationRef.current?.getFormData()

        await OrdersService.prevalidate({
            order_id: cart.id,
            cutlery_count: value,
            customer_name: formData.customer_name,
            receipt_email: formData.customer_email,
            customer_note: formData.customer_note,
            payment_method: orderParams.paymentMethod,
            scheduled_time:
                delivery_date && delivery_time
                    ? delivery_time.asap
                        ? null
                        : delivery_date.value + ' ' + delivery_time.value + ':00'
                    : null,
            change: undefined,
            ...(orderParams.orderType === TOrderType.DELIVERY
                ? {
                      street: locationFormData?.street,
                      house: locationFormData?.house,
                      locality: locationFormData?.locality,
                      province: locationFormData?.province,
                      apartment: locationFormData?.apartment,
                      porch: locationFormData?.porch,
                      floor: locationFormData?.floor,
                      door_code: locationFormData?.door_code,
                      latitude: restaurant.delivery_details?.coords.latitude ?? 0,
                      longitude: restaurant.delivery_details?.coords.longitude ?? 0,
                  }
                : {}),
        } as TPlaceOrderRequest)
    }

    return (
        <Layout orderStep={TOrderStep.CHECKOUT} recommendedProducts={recommendedProducts} title='Оформления заказа'>
            <Section className='breadcrumbs'>
                {/*<Link href={PageLinks.HOME}>главная</Link>
                <CaretLeft />*/}
                <span style={{ marginBottom: '10px' }}>{'оформление заказа'}</span>
            </Section>

            <div className='checkout-page'>
                <div className='container'>
                    <div className='checkout-page__inner d-flex'>
                        <div className='checkout-page__content'>
                            <h2 className='checkout-page__title section-title'>
                                <span>Оформление</span> заказа
                            </h2>

                            <Location ref={locationRef} />

                            <div className='checkout-page__fields d-flex flex-wrap'>
                                <div className={styles.width50}>
                                    <TextInput
                                        {...fields.customer_name}
                                        ref={(ref) => {
                                            inputRefs.current.customer_name = ref
                                            fields.customer_name.ref(ref)
                                        }}
                                        className={styles.textInput}
                                        error={formErrors.customer_name !== undefined}
                                        onKeyUp={revalidate}
                                        placeholder='Ваше имя'
                                        showLabel
                                    />
                                    {errorMessages?.name && (
                                        <div className='checkout-page__fields-error'>{errorMessages.name}</div>
                                    )}
                                </div>

                                <div className={styles.width50}>
                                    <TextInput
                                        {...fields.customer_email}
                                        ref={(ref) => {
                                            inputRefs.current.customer_email = ref
                                            fields.customer_email.ref(ref)
                                        }}
                                        className={styles.textInput}
                                        error={formErrors.customer_email !== undefined}
                                        onKeyUp={revalidate}
                                        placeholder='Ваш email'
                                        showLabel
                                    />
                                    {errorMessages?.email && (
                                        <div className='checkout-page__fields-error'>{errorMessages.email}</div>
                                    )}
                                </div>
                            </div>

                            <div className='checkout-page__fields'>
                                {restaurant !== null ? (
                                    <Datetime
                                        delivery_date={delivery_date}
                                        delivery_time={delivery_time}
                                        orderType={orderParams.orderType}
                                        deliveryZoneId={orderParams?.deliveryZoneId}
                                        setDeliveryDate={setDeliveryDate}
                                        setDeliveryTime={setDeliveryTime}
                                    />
                                ) : (
                                    false
                                )}

                                <div className={styles.blockContentComment}>
                                    <TextInput
                                        {...fields.customer_note}
                                        label='Комментарий к заказу'
                                        width='bigger'
                                        placeholder='Комментарий к заказу'
                                        ref={(ref) => {
                                            inputRefs.current.customer_note = ref
                                            fields.customer_note.ref(ref)
                                        }}
                                        showLabel
                                    />
                                </div>

                                {showBonusesRow && <BonusesRow allowDiscounts={allowDiscounts} />}
                                {showPromocode && <PromoCode allowDiscounts={allowDiscounts} />}

                                <Payment
                                    onlinePaymentsAvailable={
                                        restaurant !== null
                                            ? restaurant.accepts_online_payments !== null
                                                ? restaurant.accepts_online_payments
                                                : true
                                            : true
                                    }
                                    paymentMethod={orderParams.paymentMethod as TPaymentMethod}
                                    setPaymentMethod={orderParams.setPaymentMethod}
                                />
                            </div>
                        </div>
                        <div className='checkout-page__aside'>
                            <a href='/profile' className='checkout-page__profile d-flex items-center transition'>
                                <div className='checkout-page__profile-icon d-flex block-center'>
                                    <span className='icon-user'></span>
                                </div>
                                <div className='checkout-page__profile-info d-flex flex-column'>
                                    <h3 className='checkout-page__profile-name'>{user?.name}</h3>
                                    <span className='checkout-page__profile-text'>Мой профиль</span>
                                </div>
                                <span className='checkout-page__profile-logout icon-logout'></span>
                            </a>

                            <ul className={stylesCart.cardItemsList}>
                                {cart.items.map((item) => (
                                    <CartItem
                                        key={item.id}
                                        getReplacements={getReplacements(item)}
                                        item={item}
                                        onRemove={() => cart.removeItem(item.id)}
                                        onReplace={(replacementId: number, modifiers) =>
                                            cart.replaceItem({
                                                itemId: item.id,
                                                replacementId,
                                                modifiers,
                                            })
                                        }
                                        summaryMode
                                    />
                                ))}
                            </ul>

                            <div className={styles.cutlery}>
                                <span
                                    className='icon-fork-knife1'
                                    style={{ fontSize: '24px', color: '#C91100', marginRight: '10px' }}
                                ></span>
                                <span className={styles.counterLabel}>
                                    Приборы
                                    <br />в заказе
                                </span>
                                <Counter
                                    ref={(ref) => {
                                        inputRefs.current.cutlery_count = ref
                                        fields.cutlery_count.ref(ref)
                                    }}
                                    max={MAX_CUTLERY_QUANTITY}
                                    min={0}
                                    onChange={(value: number) => {
                                        setFieldValue('cutlery_count', value)
                                        setCutleryCount(value)
                                        updateCutleryCount(value)
                                    }}
                                    value={cutlery_count}
                                    className={styles.counter}
                                />
                            </div>

                            <div className='d-flex align-items-center'>
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

                            {error && (
                                <div
                                    className={styles.error}
                                    dangerouslySetInnerHTML={{ __html: error }}
                                    id='error_block'
                                />
                            )}

                            <div className='d-flex flex-column fullWidth-phone-large'>
                                <Button
                                    ///ref={setOrderButtonRef}
                                    className={classNames(
                                        styles.orderButton,
                                        !isOnBottom && styles.orderButtonFloating,
                                    )}
                                    disabled={orderButtonDisabled}
                                    loading={isPlacingOrder}
                                    onClick={placeOrder}
                                    size='large'
                                >
                                    Оплатить заказ
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
})

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const cookies = ctx.req.cookies as Record<string, string>
    const restaurant =
        cookies[RESTAURANT_COOKIE] !== undefined ? parseRestaurantCookie(cookies[RESTAURANT_COOKIE]) : null
    const recommendedProducts = await getRecomendedProducts(cookies.cart_id, restaurant?.id)
    return {
        props: {
            recommendedProducts,
        },
    }
}

export default Checkout
