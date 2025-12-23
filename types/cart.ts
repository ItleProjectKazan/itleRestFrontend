import { TProduct } from '~/types/catalog'
import { TDeliveryZone } from '~/types/misc'
import { TOrderType } from '~/types/order'

export type TOrderItemModifier = {
    id: number
    name: string
    group_id: number | null
    amount: number
    weight: number
    energy_amount: number
    protein_amount: number
    fat_amount: number
    carbohydrate_amount: number
    fiber_amount: number
    pivot?: {
        item_id: number
        modifier_id: number
        modifier_group_id: number
        amount: number
    }
}

export type TSimpleOrderItemModifier = Omit<TOrderItemModifier, 'group_id'>
export type TSimpleOrderItemModifierWithGroup = TOrderItemModifier

export type TCartItem = {
    has_replacement: boolean
    id: number
    product_id: number
    product: TProduct
    modifiers: TOrderItemModifier[]
    quantity: number
    is_available: number
    total_price: number
    subtotal_price: number
    updated_at: string
    discount: number | null
    dont_apply_discount: boolean
    item_type?: string
}

export type TPromocode = {
    bonus_multiplier: number
    bonus_price: number
    code: string
    name: string
    type?: 'gift' | 'regular' | null
    order_sum?: number
    is_takeaway: boolean
    is_delivery: boolean
}

export type TCart = {
    id: string
    bonus_max: number | null
    bonus_received: number | null
    bonus_used: number | null
    bonus_percent: number | null
    order_type: TOrderType
    restaurant_id: number | null
    delivery_zone: TDeliveryZone
    items: TCartItem[]
    subtotal_price: number
    discountable_subtotal: number
    pickup_discount_sum: number
    promocode: TPromocode
    total_price: number
    cutlery_count: number | null
}
