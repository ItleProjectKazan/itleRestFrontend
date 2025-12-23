import { TPaymentMethod } from '~/types/order'

export type TPlaceOrderRequestBase = {
    order_id: string
    customer_name: string
    customer_note?: string
    receipt_email?: string
    scheduled_time: string | null
    payment_method: TPaymentMethod
    cutlery_count: number
    change?: number
}

export type TPlaceOrderRequestDelivery = {
    street: string
    house: string
    floor?: string
    apartment?: string
    porch?: string
    door_code?: string
    latitude: number
    longitude: number
}

export type TPlaceOrderRequest = TPlaceOrderRequestBase & TPlaceOrderRequestDelivery
