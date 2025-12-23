import { TCartItem, TPromocode } from '~/types/cart'
import { TDeliveryZone } from '~/types/misc'

export type TDeliveryTime = {
    delivery_date: string
    delivery_time: string
}

export enum TOrderType {
    DELIVERY = 'delivery',
    PICKUP = 'pickup',
}

export enum TOrderStatus {
    DRAFT = 'draft',
    NEW = 'new',
    CONFIRMED = 'confirmed',
    PREPARING = 'preparing',
    PREPARED = 'prepared',
    DELIVERING = 'delivering',
    DELIVERED = 'delivered',
    CANCELED = 'canceled',
}

export type TOrderStatuses =
    | 'draft'
    | 'new'
    | 'confirmed'
    | 'preparing'
    | 'prepared'
    | 'delivering'
    | 'delivered'
    | 'canceled'

export enum TPaymentMethod {
    CARD_ONLINE = 'card-online',
    CASH = 'cash',
    CARD_COURIER = 'card-courier',
    SBP_ONLINE = 'sbp-online',
}

export enum TOrderStep {
    CART = 'cart',
    CHECKOUT = 'checkout',
    PROCESSING = 'processing',
}

export type TOrder = {
    id: string
    order_id: number
    uuid: string
    type: TOrderType
    status: TOrderStatus
    bonus_received: number | null
    bonus_used: number | null
    customer_email: string | null
    customer_name: string | null
    customer_phone_number: string | null
    restaurant_id: number | null
    customer_note: string | null
    scheduled_time: string
    subtotal_price: number
    discountable_subtotal: number
    pickup_discount_sum: number
    total_price: number
    payment_method: TPaymentMethod | null
    change: number | null
    cutlery_amount: number | null
    total_quantity: number | null
    delivery_fee: number | null
    restaurant: {
        id: number
        name: string
        address: string
    }
    delivery_zone: TDeliveryZone
    address:
        | (TDeliveryAddress & {
              locality: string
          })
        | null
    items: TCartItem[] | null
    is_placed: boolean
    promocode: TPromocode
    updated_at?: string
    payments: {
        id: number
        status: 'success' | 'faild' | 'new'
        order_id: number
    }[]
}

export type TDeliveryAddress = {
    locality: string
    province: string
    apartment: string
    porch: string
    floor: string
    door_code: string
    street: string
    house: string
}
