import { useCallback, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'

import { useCurrentRestaurant, useStore } from '~/hooks'
import { CartService, TCartResponse } from '~/services/cart'
import { SettingsService } from '~/services/settingsService'

import { TOrderItemModifier } from '~/types/cart'
import { TSelectedRestaurantInfo } from '~/types/misc'
import { TOrderType } from '~/types/order'

import { RESTAURANT_COOKIE, ORDER_TYPE_COOKIE } from '~/constants/misc'

export const CART_QUERY_KEY = 'cart'

export const fetchCart = async () => {
    const response = await CartService.get()

    return response.data
}

export const useCart = () => {
    const queryClient = useQueryClient()
    const { orderParams } = useStore()
    const currentRestaurant = useCurrentRestaurant()

    const response = useQuery<TCartResponse>(CART_QUERY_KEY, fetchCart, {
        refetchOnWindowFocus: false,
        // use cached data if it cached less than 10 minutes ago
        staleTime: 10 * 60 * 1000,
    })

    const cart = response.data?.cart ?? null

    const update = useCallback(() => {
        queryClient.invalidateQueries(CART_QUERY_KEY)
    }, [queryClient])

    const selectRestaurant = useCallback(
        async (orderType: TOrderType, restaurant: TSelectedRestaurantInfo) => {
            orderParams.setRestaurant(orderType, restaurant)

            if (cart !== null) {
                try {
                    await CartService.selectRestaurant({
                        orderType,
                        restaurantId: restaurant.id,
                        deliveryZoneId: restaurant.delivery_zone_id,
                    })
                } catch (error) {
                    console.error(error)
                }
                update()
            }

            SettingsService.set(ORDER_TYPE_COOKIE, orderType)
            SettingsService.set(RESTAURANT_COOKIE, JSON.stringify(restaurant))
        },
        [cart, orderParams, update],
    )

    const createCart = useCallback(async () => {
        let deliveryZoneId = orderParams.deliveryZoneId
        if (currentRestaurant !== null && deliveryZoneId == null) {
            const pickupDeliveryZone = currentRestaurant.delivery_zones.find((zone) => {
                return zone.type === TOrderType.PICKUP
            })

            if (pickupDeliveryZone === undefined) {
                throw new Error(`Pickup delivery zone doesnt't exist in restaurant #${currentRestaurant.id}`)
            }

            deliveryZoneId = pickupDeliveryZone.id
        }

        if (CartService.getId() === null && currentRestaurant !== null && deliveryZoneId !== null) {
            await CartService.create({
                type: orderParams.orderType as TOrderType,
                restaurant_id: currentRestaurant?.id as number,
                delivery_zone_id: deliveryZoneId,
            })

            update()

            return true
        }
    }, [currentRestaurant, orderParams.deliveryZoneId, orderParams.orderType, update])

    const add = useMutation(
        async ({ productId, modifiers }: { productId: number; modifiers: TOrderItemModifier[] }) => {
            await createCart()

            try {
                return await CartService.add({
                    product_id: productId,
                    modifiers,
                })
            } catch (error: any) {
                if (error?.response?.status === 422) {
                    await createCart()

                    return await CartService.add({
                        product_id: productId,
                        modifiers,
                    })
                }

                throw error
            }
        },
        {
            onSuccess: update,
        },
    )

    const updateItem = useMutation(
        async ({
            itemId,
            modifiers,
            quantity,
        }: {
            itemId: number
            modifiers: TOrderItemModifier[]
            quantity: number
        }) =>
            CartService.updateItem({
                item_id: itemId,
                modifiers,
                quantity,
            }),
        {
            onSuccess: update,
        },
    )

    const replaceItem = useMutation(
        async ({
            itemId,
            replacementId,
            modifiers,
        }: {
            itemId: number
            replacementId: number
            modifiers: TOrderItemModifier[]
        }) =>
            CartService.replaceItem({
                item_id: itemId,
                replacement_id: replacementId,
                modifiers,
            }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(CART_QUERY_KEY)
            },
        },
    )

    const removeItem = useMutation(
        (itemId: number) =>
            CartService.removeItem({
                item_id: itemId,
            }),
        {
            onSuccess: update,
        },
    )

    const clear = useMutation(() => CartService.clear(), {
        onSuccess: update,
    })

    const items = useMemo(() => cart?.items ?? [], [cart])
    const totalQuantity = useMemo(() => items.reduce((quantity, item) => quantity + item.quantity, 0), [items])

    return useMemo(
        () => ({
            add: add.mutate,
            clear: clear.mutate,
            bonus_max: cart?.bonus_max ?? 0,
            bonus_received: cart?.bonus_received ?? 0,
            bonus_used: cart?.bonus_used ?? 0,
            bonus_percent: cart?.bonus_percent ?? 0,
            createCart,
            deliveryZone: cart?.delivery_zone ?? null,
            fetchingStatus: response.status,
            id: cart?.id ?? null,
            items,
            isEmpty: items.length === 0,
            promocode: cart?.promocode,
            restaurantId: cart?.restaurant_id ?? null,
            removeItem: removeItem.mutate,
            replaceItem: replaceItem.mutate,
            totalPrice: cart?.total_price ?? 0,
            selectRestaurant,
            subtotalPrice: cart?.subtotal_price ?? 0,
            discountableSubtotal: cart?.discountable_subtotal ?? 0,
            totalQuantity,
            type: cart?.order_type,
            update,
            updateItem: updateItem.mutate,
            cutlery_count: cart?.cutlery_count ?? 0,
        }),
        [
            add.mutate,
            cart,
            clear.mutate,
            createCart,
            items,
            removeItem.mutate,
            replaceItem.mutate,
            response.status,
            selectRestaurant,
            totalQuantity,
            update,
            updateItem.mutate,
        ],
    )
}
