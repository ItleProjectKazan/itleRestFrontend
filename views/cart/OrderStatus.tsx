import React, { useMemo } from 'react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { QueryClient } from 'react-query'
import { setCookie } from 'cookies-next'
import { http } from '~/core/axios'
import { parseRestaurantCookie } from '~/helpers'
import { getPrettyDayView, getTimeFromDate, fetchUser, findLocalityByRestaurant } from '~/helpers'
import { setAuthToken, setRequestHeaders } from '~/core/auth'
import { useOrders, useCurrentLocality, useStore } from '~/hooks'
import { fetchOrders, ORDERS_QUERY_KEY } from '~/hooks/useOrders'
import { Layout, Section, Typography } from '~/components'
import { TOrder, TOrderStatus, TOrderStep, TOrderType /*, TPaymentMethod*/ } from '~/types/order'
import { TProduct } from '~/types/catalog'
import { RESTAURANT_COOKIE } from '~/constants/misc'
import { ApiEndpoints } from '~/constants/apiEndpoints'
import { PageLinks } from '~/constants/pageLinks'
import { ALERT_MESSAGE_COOKIE } from '~/constants/misc'
import { SupportPhone } from '~/constants/content'
import styles from './OrderStatus.module.scss'
import PhoneIcon from '~/public/images/icon-tel.svg'
import { normalizePhone } from '~/helpers'

interface IOrderStatus {
    recommendedProducts: TProduct[]
}

const OrderStatus: NextPage<IOrderStatus> = observer(({ recommendedProducts }: IOrderStatus) => {
    const router = useRouter()
    const { localities } = useStore()
    const currentLocality = useCurrentLocality()

    const { orders } = useOrders(router.query.orderId as string | undefined)

    const order = useMemo(() => {
        const orderId = router.query.orderId
        return orders?.find((order) => order.id === orderId) ?? null
    }, [orders, router.query.orderId])

    // if (order === null && typeof window !== 'undefined') {
    // redirect(PageLinks.HOME)
    // }
    if (order === null) {
        return <></>
    }
    const restaurantId = order !== null ? order.restaurant_id : null
    const locality = restaurantId ? findLocalityByRestaurant(localities, restaurantId) : currentLocality
    const supportPhoneNumber = locality?.support_phone_number ?? SupportPhone.href

    const orderCanceled = order.status === TOrderStatus.CANCELED

    // const orderImage = orderCanceled
    //     ? '/images/order-canceled.svg'
    //     : order.type === TOrderType.DELIVERY
    //       ? '/images/checkout-success.svg'
    //       : '/images/order-pickup.svg'

    return (
        <Layout orderStep={TOrderStep.PROCESSING} recommendedProducts={recommendedProducts} title='Ваш заказ принят'>
            <Section className='order-status d-flex flex-wrap' title='заказ принят'>
                <div className='container'>
                    <div className='order-status__inner d-flex'>
                        <div className='order-status__info d-flex flex-column items-start'>
                            <h1 className='order-status__info-title section-title'>
                                {!orderCanceled ? (
                                    order.type === TOrderType.DELIVERY ? (
                                        'Спасибо! Собираем заказ и вылетаем!'
                                    ) : (
                                        <>
                                            <span>ваш заказ</span> принят
                                        </>
                                    )
                                ) : (
                                    <>
                                        ваш заказ <span>отменен</span>
                                    </>
                                )}
                            </h1>
                            <div className='order-status__info-number d-flex items-center'>
                                <span>номер заказа</span>&nbsp;{order.order_id}
                            </div>
                            {!orderCanceled ? (
                                <>
                                    <div className='order-status__info-details d-flex items-center'>
                                        {order.type === TOrderType.DELIVERY ? (
                                            'Мы привезём вам нашу вкусную еду.'
                                        ) : // order.scheduled_time !== null && order.scheduled_time.length ? (
                                        //     'Мы привезём вам нашу вкусную еду.'
                                        // ) : (
                                        //     'доставим в течении часа'
                                        // )
                                        order.scheduled_time !== null && order.scheduled_time.length ? (
                                            <>
                                                Ваш заказ будет готов к выдаче: <br />
                                                {getPrettyDayView(new Date(order.scheduled_time))} в{' '}
                                                {getTimeFromDate(new Date(order.scheduled_time))}
                                            </>
                                        ) : (
                                            'Ваш заказ будет готов к выдаче как можно скорее.'
                                        )}
                                    </div>
                                    <div className='order-status__info-text'>
                                        <p>
                                            {/* В ближайшие минуты с вами свяжется менеджер для подтверждения заказа.
                                            Оставайтесь на связи! */}
                                            Сейчас мы не перезваниваем
                                        </p>
                                    </div>

                                    <div>
                                        <Typography className={styles.addressTerm} color='black' weight='bold'>
                                            Адрес:
                                        </Typography>
                                        {order.type === TOrderType.DELIVERY && order.address !== null && (
                                            <Typography className={styles.addressDef} color='black'>
                                                {[
                                                    order.address.locality,
                                                    order.address.street,
                                                    order.address.house,
                                                ].join(', ')}
                                            </Typography>
                                        )}
                                        {order.type === TOrderType.PICKUP && (
                                            <Typography className={styles.addressDef} color='black'>
                                                {order.restaurant.address}
                                            </Typography>
                                        )}
                                    </div>
                                </>
                            ) : null}
                            <br />

                            <div className={styles.phoneSection}>
                                <Typography className={styles.phoneSectionText} color='brown'>
                                    Есть вопросы звоните по телефону:
                                </Typography>
                                <div>
                                    <a aria-label='ИТЛЕ телефон' className='d-flex' href={`tel:${normalizePhone}`}>
                                        <PhoneIcon className={styles.phoneSectionIcon} />
                                        <div className={styles.phoneSectionPhone} color='secondary'>
                                            {supportPhoneNumber}
                                        </div>
                                    </a>
                                </div>
                            </div>

                            <a href={PageLinks.HOME} className='order-status__info-btn d-flex items-center transition'>
                                Перейти на главную
                            </a>
                        </div>

                        <div className='order-status__image'>
                            <img src='/images/order-status-image.png' alt='order status image' />
                        </div>
                    </div>
                </div>
            </Section>

            {/* <Section>
                <div className={styles.top}>
                    <div className={styles.topContent}>
                        <div className={styles.hero}>
                            <div className={styles.heroText}>
                                {!orderCanceled && (
                                    <>
                                        <div className={styles.heroMainText}>
                                            <div className={styles.cancelIcon}>
                                                <SuccessCheckIcon alt='' height={50} width={50} />
                                            </div>
                                            <Typography className={styles.heroTitle} color='black' weight='bold'>
                                                {order.type === TOrderType.DELIVERY
                                                    ? 'Спасибо! Собираем заказ и вылетаем!'
                                                    : 'Ваш заказ принят!'}
                                            </Typography>
                                        </div>
                                        <Typography className={styles.heroSubtitle} color='black' weight='bold'>
                                            {order.type === TOrderType.DELIVERY
                                                ? order.scheduled_time !== null && order.scheduled_time.length
                                                    ? 'Мы привезём вам нашу вкусную еду.'
                                                    : 'Совсем скоро мы привезём вам нашу вкусную еду.'
                                                : order.scheduled_time !== null && order.scheduled_time.length
                                                  ? 'Ваш заказ будет готов к выдаче: ' +
                                                    getPrettyDayView(new Date(order.scheduled_time)) +
                                                    ' в ' +
                                                    getTimeFromDate(new Date(order.scheduled_time))
                                                  : 'Ваш заказ будет готов к выдаче как можно скорее.'}
                                        </Typography>
                                    </>
                                )}
                                {orderCanceled && (
                                    <>
                                        <div className={styles.heroMainText}>
                                            <div className={styles.cancelIcon}>
                                                <TimesCircleIcon alt='' height={50} width={50} />
                                            </div>
                                            <Typography className={styles.heroTitle} color='black' weight='bold'>
                                                Ваш заказ отменен.
                                            </Typography>
                                        </div>
                                        {order.payment_method === TPaymentMethod.CARD_ONLINE && (
                                            <Typography className={styles.heroSubtitle} color='black' weight='bold'>
                                                Вы отменили заказ. Деньги вернутся на карту.
                                            </Typography>
                                        )}
                                    </>
                                )}
                                <div className={styles.address}>
                                    <div>
                                        <Typography className={styles.addressTerm} color='black' weight='bold'>
                                            Адрес:
                                        </Typography>
                                        {order.type === TOrderType.DELIVERY && order.address !== null && (
                                            <Typography className={styles.addressDef} color='black'>
                                                {[
                                                    order.address.locality,
                                                    order.address.street,
                                                    order.address.house,
                                                ].join(', ')}
                                            </Typography>
                                        )}
                                        {order.type === TOrderType.PICKUP && (
                                            <Typography className={styles.addressDef} color='black'>
                                                {order.restaurant.address}
                                            </Typography>
                                        )}
                                    </div>
                                    {order.type === TOrderType.DELIVERY && (
                                        <div>
                                            <Typography className={styles.addressTerm} color='black' weight='bold'>
                                                Время доставки:
                                            </Typography>
                                            <Typography className={styles.addressDef} color='black'>
                                                {order.scheduled_time !== null && order.scheduled_time.length
                                                    ? getPrettyDayView(new Date(order.scheduled_time)) +
                                                      ' в ' +
                                                      getTimeFromDate(new Date(order.scheduled_time))
                                                    : 'Как можно скорее'}
                                            </Typography>
                                        </div>
                                    )}
                                    {order.customer_note && (
                                        <div>
                                            <Typography className={styles.addressTerm} color='black' weight='bold'>
                                                Комментарий:
                                            </Typography>
                                            <Typography className={styles.noteDef} color='black'>
                                                {order.customer_note}
                                            </Typography>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles.heroImg}>
                                <Image alt='' className={styles.heroImg} height={228} src={orderImage} width={305} />
                            </div>
                        </div>
                        <Section title='Есть вопросы?'>
                            <div className={styles.phoneSection}>
                                <Typography className={styles.phoneSectionText} color='brown'>
                                    Звоните по телефону:
                                </Typography>
                                <a className='d-flex align-items-center' href='tel:+78435006035'>
                                    <PhoneIcon className={styles.phoneSectionIcon} />
                                    <Typography className={styles.phoneSectionPhone} color='secondary' weight='bold'>
                                        {supportPhoneNumber}
                                    </Typography>
                                </a>
                            </div>
                        </Section>
                    </div>
                </div>
            </Section>
            {order.items !== null && (
                <Section bordered title='Состав заказа'>
                    <ul className={stylesCart.cardItemsList}>
                        {order.items.map((item) => (
                            <CartItem key={item.id} item={item} summaryMode />
                        ))}
                    </ul>
                </Section>
            )}
            <Section className={styles.totalsSection}>
                <div className='d-flex align-items-center px-md-0' style={{ width: '100%' }}>
                    <Total
                        bonus_received={order?.bonus_received}
                        bonus_used={order?.bonus_used}
                        deliveryZone={order.delivery_zone as TDeliveryZone}
                        page='result'
                        promocode={order?.promocode}
                        subtotalPrice={order.subtotal_price}
                        totalPrice={order.total_price}
                        productsCount={order.items ? order.items.length : 0}
                    />
                </div>
            </Section> */}
        </Layout>
    )
})

const redirectToIndex = {
    redirect: {
        destination: PageLinks.HOME,
        permanent: false,
    },
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const request = ctx.req
    const params = ctx.params
    const cookies = (request?.cookies ?? {}) as Record<string, string>
    const restaurant =
        cookies[RESTAURANT_COOKIE] !== undefined ? parseRestaurantCookie(cookies[RESTAURANT_COOKIE]) : null

    setRequestHeaders((request?.headers ?? {}) as any)
    setAuthToken(cookies.token)

    const orderId = params?.orderId as string | undefined

    if (orderId === undefined) {
        setCookie(ALERT_MESSAGE_COOKIE, 'Order ID is empty.', {
            req: ctx.req,
            res: ctx.res,
        })

        return redirectToIndex
    }

    const user = await fetchUser()

    if (user === null) {
        setCookie(ALERT_MESSAGE_COOKIE, 'Unauthenticated.', {
            req: ctx.req,
            res: ctx.res,
        })

        return redirectToIndex
    }

    const queryClient = new QueryClient()

    await queryClient.prefetchQuery<TOrder[]>([ORDERS_QUERY_KEY, orderId], () => fetchOrders(orderId))

    const orders = await queryClient.fetchQuery<TOrder[]>([ORDERS_QUERY_KEY, orderId], () => fetchOrders(orderId), {
        // use cached data if it cached less than 5 seconds ago
        staleTime: 5000,
    })

    if (orders.length === 0) {
        setCookie(ALERT_MESSAGE_COOKIE, 'Order not found.', {
            req: ctx.req,
            res: ctx.res,
        })

        return redirectToIndex
    }

    if (!orders[0].is_placed) {
        setCookie(ALERT_MESSAGE_COOKIE, 'Order is not placed.', {
            req: ctx.req,
            res: ctx.res,
        })

        return redirectToIndex
    }

    const [recommendedProducts] = await Promise.all([
        http.get<TProduct[]>(ApiEndpoints.CART_RECOMMENDED_PRODUCTS, {
            params: {
                cart_id: cookies.cart_id,
                restaurant_id: restaurant?.id,
            },
        }),
    ])

    return {
        props: {
            recommendedProducts: recommendedProducts.data,
        },
    }
}

export default OrderStatus
