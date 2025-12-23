import { FC, useState, useEffect } from 'react'
import cn from 'classnames'
import { observer } from 'mobx-react-lite'
import { useQuery } from 'react-query'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
// import { http } from '~/core/axios'
// import { ApiEndpoints } from '~/constants/apiEndpoints'
// import { useCart } from '~/hooks'
import Pagination from '~/components/Pagination'
import { TOrder, TOrderStatuses } from '~/types/order'
import { Loader } from '~/components'
import { QUERY_KEYS } from '~/views/home/constants'
import { getAuthCustomer } from '~/services/queries'
import { TCartItem } from '~/types/cart'
// import { useStore } from '~/hooks'

const statusText: Record<TOrderStatuses, string> = {
    draft: 'Черновик',
    new: 'Новый',
    confirmed: 'Подтвержденный',
    preparing: 'Готовится',
    prepared: 'Готово',
    delivering: 'Доставляется',
    delivered: 'Доставлен',
    canceled: 'Отменен',
}

type TOrderResponse = Omit<TOrder, 'status'> & { status: TOrderStatuses }

const ProfileOrder: FC = observer(() => {
    // const { textModal } = useStore()
    // const cart = useCart()
    const [pagesCount, setPagesCount] = useState(0)
    const [orders, setOrders] = useState<TOrderResponse[]>()
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const maxItems = 21
    const limit = 3
    const offset = (page - 1) * limit
    const requestStatuses = ['new', 'confirmed', 'preparing', 'prepared', 'delivering', 'delivered', 'canceled']

    const responseOrders = useQuery<{ orders: TOrderResponse[]; count: number }>(
        QUERY_KEYS.AUTH_CUSTOMER(offset, limit),
        () => getAuthCustomer(limit, offset, requestStatuses),
        {
            refetchOnWindowFocus: false,
        },
    ).data

    useEffect(() => {
        if (responseOrders?.orders) {
            setOrders(responseOrders.orders)
            const maxCount = responseOrders.count > maxItems ? maxItems : responseOrders.count
            const pCount = Math.ceil(maxCount / limit)
            setPagesCount(pCount)
            setLoading(false)
        }
    }, [responseOrders])

    const pageClick = (page: number) => {
        setLoading(true)
        setPage(page)
    }

    const isActiveOrder = (status: TOrderStatuses): boolean =>
        status !== 'delivered' && status !== 'draft' && status !== 'canceled'

    const isEveryProductExists = (items: TCartItem[] | null): boolean =>
        items && items.length ? items.every(({ product }) => product) : false

    // const onCancelOrder = (uuid: string) => async () => {
    //     if (!uuid) return
    //     try {
    //         const response = await http.post(ApiEndpoints.ORDERS_CANCEL, {
    //             order_id: uuid,
    //         })
    //         if (response.status === 200) {
    //             const newOrders = orders?.map((item: TOrderResponse) => {
    //                 if (item.uuid === uuid) {
    //                     return { ...item, status: 'canceled' as TOrderStatuses }
    //                 }
    //                 return item
    //             })
    //             setOrders(newOrders)
    //             textModal.open('Отмена заказа', 'Ваш заказ отменен. Приходите еще.')
    //         }
    //     } catch (e) {
    //         console.error(e)
    //     }
    // }
    // const onRepeatOrder = (order: TOrderResponse) => async () => {
    //     if (!order?.items || !order.items.length) return
    //     order.items.map(({ product_id, quantity, modifiers }) => {
    //         for (let i = 0; i < quantity; i++) {
    //             const m = modifiers.map((item) => {
    //                 const result = { ...item, amount: item?.pivot?.amount || 1 }
    //                 if (item?.pivot?.modifier_group_id) {
    //                     result.group_id = item.pivot.modifier_group_id
    //                 }
    //                 return result
    //             })
    //             cart.add({
    //                 productId: product_id,
    //                 modifiers: m || [],
    //             })
    //         }
    //     })
    //     textModal.open('Повтор заказа', 'Продукты добавленны в Вашу корзину')
    // }

    if (loading) {
        return (
            <div className='profile-page__orders'>
                <div className='main-banner__slide loading'>
                    <Loader />
                </div>
            </div>
        )
    }
    return (
        <>
            <div className='profile-page__orders'>
                <h2 className='profile-page__subtitle'>Мои заказы</h2>
                <div className='profile-page__orders-list'>
                    {!orders || orders?.length === 0 ? (
                        <>У вас пока нет заказов. Оформите первый заказ и наслаждайтесь нашими вкусными предложениями</>
                    ) : (
                        orders.map((order: TOrderResponse) => (
                            <div key={order.id} className='order'>
                                <div className='order__top d-flex items-center'>
                                    <div className='order__status d-flex flex-column'>
                                        <span
                                            className={cn('order__status-title', {
                                                'is-active': isActiveOrder(order.status),
                                            })}
                                        >
                                            {statusText[order.status]}
                                        </span>
                                        <span className='order__status-time'>
                                            {isActiveOrder(order.status) && order?.scheduled_time ? (
                                                <>
                                                    Доставим до -{' '}
                                                    {format(new Date(order.scheduled_time), 'dd MMMM H:mm', {
                                                        locale: ru,
                                                    })}
                                                </>
                                            ) : null}
                                            {order.status === 'delivered' && order?.updated_at ? (
                                                <>
                                                    Доставлен -{' '}
                                                    {format(new Date(order.updated_at), 'dd MMMM H:mm', {
                                                        locale: ru,
                                                    })}
                                                </>
                                            ) : null}
                                        </span>
                                    </div>
                                    {order.status !== 'draft' && isEveryProductExists(order.items) ? (
                                        <div className='order__actions d-flex'>
                                            {/* {order.status === 'delivered' ? (
                                            <button className='order__actions-btn d-flex items-center transition'>
                                                Повторить заказ
                                            </button>
                                        ) : null} */}
                                            {/* {isActiveOrder(order.status) ? (
                                                <button
                                                    onClick={onCancelOrder(order.uuid)}
                                                    className='order__actions-btn d-flex items-center transition'
                                                >
                                                    Отменить
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={onRepeatOrder(order)}
                                                    className='order__actions-btn d-flex items-center transition'
                                                >
                                                    Повторить заказ
                                                </button>
                                            )} */}
                                            {order.payments.at(-1)?.status === 'success' ? (
                                                <div className='order__actions-paid d-flex items-center'>
                                                    Оплачен
                                                    <span className='icon-check-circle'></span>
                                                </div>
                                            ) : null}
                                        </div>
                                    ) : null}
                                </div>
                                <div className='order-products d-flex flex-wrap'>
                                    {order?.items?.map((item) => (
                                        <div key={item.id} className='order-product d-flex'>
                                            <div className='order-product__inner d-flex items-center'>
                                                {item.product ? (
                                                    <>
                                                        <div className='order-product__image d-flex block-center'>
                                                            {item.product?.nova_image ? (
                                                                <img
                                                                    src={item.product.nova_image}
                                                                    className='order-product__image-img'
                                                                    alt='product image'
                                                                />
                                                            ) : null}
                                                        </div>

                                                        <div className='order-product__info d-flex flex-column'>
                                                            <div className='order-product__info-title'>
                                                                {item.product.name}
                                                            </div>
                                                            <div>
                                                                {item.modifiers.map(({ id, name }) => (
                                                                    <div style={{ fontSize: '10px' }} key={id}>
                                                                        {name}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <span className='order-product__info-weight'>
                                                                {(item.product.weight * 1000).toFixed(0)} грамм
                                                            </span>
                                                            <div className='order-product__info-bottom d-flex items-center justify-between'>
                                                                <span className='order-product__info-price'>
                                                                    {item.total_price} ₽
                                                                </span>
                                                                <div className='order-product__info-count d-flex items-center'>
                                                                    {item.quantity} шт
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div>Продукт удален</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className='order-details d-flex flex-wrap justify-between'>
                                    <div className='order-details__info d-flex flex-wrap'>
                                        <div className='order-details__info-item d-flex'>
                                            Товары ({order?.total_quantity}) -<span>{order.subtotal_price} ₽</span>
                                        </div>
                                        {/* <div className='order-details__info-item d-flex'>
                                            Скидка к заказу -<span>{order.discountable_subtotal} ₽</span>
                                        </div> */}
                                        <div className='order-details__info-item d-flex'>
                                            Доставка по городу -
                                            {order?.delivery_fee ? (
                                                <span>{order.delivery_fee}</span>
                                            ) : (
                                                <span>Бесплатно</span>
                                            )}
                                        </div>
                                    </div>

                                    <span className='order-details__amount'>Сумма заказа - {order.total_price} ₽</span>
                                </div>
                            </div>
                        ))
                    )}
                    <Pagination pagesCount={pagesCount} currentPage={page} pageClick={pageClick} />
                </div>
            </div>
        </>
    )
})

export default ProfileOrder
