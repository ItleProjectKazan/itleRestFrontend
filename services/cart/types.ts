import { TCart, TOrderItemModifier } from '~/types/cart'
import { TOrderType } from '~/types/order'

export type TCartResponse = {
    cart: TCart | null
}

export type TCartApiCreateRequest = {
    type: TOrderType
    restaurant_id: number
    delivery_zone_id: number
}

export type TCartApiAddRequest = {
    product_id: number
    modifiers: TOrderItemModifier[]
}

export type TCartApiUpdateRequest = {
    item_id: number
    modifiers: TOrderItemModifier[]
    quantity: number
}

export type TCartApiRemoveRequest = {
    item_id: number
}

export type TCartApiReplaceRequest = {
    item_id: number
    replacement_id: number
    modifiers: TOrderItemModifier[]
}

export type TCartApiGetReplacementsRequest = {
    category_id: number
    restaurant_id: number
}

export type TCartApiSelectRestaurantRequest = {
    orderType: TOrderType
    restaurantId: number
    deliveryZoneId: number
}

export type TCartAppendPromocode = {
    cart_id: string
    restaurant_id: number
    type: TOrderType
    code: string
}

export type TCartResetPromocode = {
    cart_id: string
    type: TOrderType
}

export type TCartAppendBonuses = {
    order_id: string
    bonus_used: number
}

export type TCartResetBonuses = {
    order_id: string
}
