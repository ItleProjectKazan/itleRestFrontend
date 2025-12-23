import { useMutation, useQuery, useQueryClient } from 'react-query'

import { OrdersService } from '~/services/ordersService/ordersService'

import { CART_QUERY_KEY } from '~/hooks/useCart'

import { TOrder } from '~/types/order'

export const ORDERS_QUERY_KEY = 'orders'

export const fetchOrders = async (orderId?: string) => {
    const response = await OrdersService.getOrders(orderId)

    return response.data
}

export const useOrders = (orderId?: string) => {
    const queryClient = useQueryClient()

    const queryKey = [ORDERS_QUERY_KEY, orderId]

    const response = useQuery<TOrder[]>([ORDERS_QUERY_KEY, orderId], () => fetchOrders(orderId), {
        refetchOnWindowFocus: false,
        // use cached data if it cached less than 10 minutes ago
        staleTime: 10 * 60 * 1000,
    })

    const orders = response.data ?? null

    const cancel = useMutation((orderId: string) => OrdersService.cancel(orderId), {
        onSuccess: () => {
            queryClient.invalidateQueries(CART_QUERY_KEY)
            queryClient.invalidateQueries(queryKey)
        },
    })

    return {
        orders,
        cancelOrder: cancel.mutate,
    }
}
