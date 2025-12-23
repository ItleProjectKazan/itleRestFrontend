import { http } from '~/core/axios'

import { ApiEndpoints } from '~/constants/apiEndpoints'
import { TPlaceOrderRequest } from '~/services/ordersService/types'

export const OrdersService = {
    getOrders: (orderId?: string) => {
        return http.get(ApiEndpoints.ORDERS, {
            params: {
                order_id: orderId,
            },
        })
    },

    place: (parameters: TPlaceOrderRequest) => {
        return http.post(ApiEndpoints.ORDERS_PLACE, parameters)
    },

    prevalidate: (parameters: TPlaceOrderRequest) => {
        return http.post(ApiEndpoints.ORDERS_PREVALIDATE, parameters)
    },

    cancel: (orderId: string) => {
        return http.post(ApiEndpoints.ORDERS_CANCEL, {
            order_id: orderId,
        })
    },
}
