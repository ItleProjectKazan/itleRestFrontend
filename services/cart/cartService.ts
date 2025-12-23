import { http } from '~/core/axios'
import { SettingsService } from '~/services/settingsService'

import { ApiEndpoints } from '~/constants/apiEndpoints'
import {
    TCartApiAddRequest,
    TCartApiCreateRequest, TCartApiGetReplacementsRequest,
    TCartApiRemoveRequest, TCartApiReplaceRequest, TCartApiSelectRestaurantRequest,
    TCartApiUpdateRequest,
    TCartResponse,
    TCartAppendPromocode,
    TCartAppendBonuses,
    TCartResetBonuses,
    TCartResetPromocode,
} from './types'
import { TProduct } from '~/types/catalog'

const CART_ID_KEY = 'cart_id'

export const NEXT_SERVER = process.env.NEXT_SERVER

http.interceptors.request.use(request => {
    if (NEXT_SERVER == 'development') {
        /*
        if (request.method == 'get' || request.method == 'post') {
            console.warn('REQUEST:')
            if (request.baseURL) {
                console.log('### Endpoint:')
                console.log(request.baseURL + request.url)
            }
            if (request.params) {
                console.log('### Params:')
                console.log(request.params)
            }
            if (request.data) {
                console.log('### Data:')
                console.log(request.data)
            }
        }
        */
    }

    return request
})

http.interceptors.response.use(response => {
    if (NEXT_SERVER == 'development') {
        if (response.status !== 204) {
            /*
            console.warn('RESPONSE:')
            console.log('### Status:')
            console.log(response.status)
            console.log('### Data:')
            console.log(response.data)
            */
        }
    }

    return response
}, (error) => {
    if (NEXT_SERVER == 'development') {
        /*
        console.error('RESPONSE | ERROR:')
        console.log('### Status:')
        console.log(error.response.status)
        console.log('### Data:')
        console.log(error.response.data)
        */
    }

    return Promise.reject(error)
})

export const CartService = {
    // cart ID for SSR
    cartId: null as string | null,

    getId: () => {
        if (CartService.cartId === null) {
            CartService.cartId = SettingsService.get(CART_ID_KEY)
        }

        return CartService.cartId
    },

    setId: (id: string | null) => {
        CartService.cartId = id
    },

    clearId: () => {
        CartService.cartId = null

        SettingsService.remove(CART_ID_KEY)
    },

    get: (cartId?: string) => {
        return http.get<TCartResponse>(ApiEndpoints.CART, {
            params: {
                cart_id: cartId ?? CartService.getId(),
            },
        })
    },

    create: async (data: TCartApiCreateRequest) => {
        const { id } = (await http.post<{
            id: string
        }>(ApiEndpoints.CART_CREATE, data)).data

        CartService.cartId = id

        SettingsService.set(CART_ID_KEY, id)
    },

    add: (data: TCartApiAddRequest) => {
        return http.post(ApiEndpoints.CART_ADD, {
            cart_id: CartService.getId(),
            product_id: data.product_id,
            modifiers: data.modifiers,
        })
    },

    updateItem: (data: TCartApiUpdateRequest) => {
        return http.post(ApiEndpoints.CART_UPDATE_ITEM, {
            cart_id: CartService.getId(),
            item_id: data.item_id,
            modifiers: data.modifiers,
            quantity: data.quantity,
        })
    },

    removeItem: (data: TCartApiRemoveRequest) => {
        return http.post(ApiEndpoints.CART_REMOVE_ITEM, {
            cart_id: CartService.getId(),
            ...data,
        })
    },

    getReplacements: (data: TCartApiGetReplacementsRequest)  => {
        return http.get<TProduct[]>(ApiEndpoints.PRODUCTS, {
            params: data,
        })
    },

    replaceItem: async (data: TCartApiReplaceRequest) => {
        return await http.post(ApiEndpoints.CART_REPLACE_PRODUCT, {
            cart_id: CartService.getId(),
            ...data,
        })
    },

    clear: async (cartId?: string) => {
        return await http.post<TCartResponse>(ApiEndpoints.CART_CLEAR, {
            cart_id: cartId ?? CartService.getId(),
        })
    },

    appendPromocode: (parameters: TCartAppendPromocode) => {
        return http.post(ApiEndpoints.APPEND_PROMOCODE, parameters)
    },

    appendBonuses: (parameters: TCartAppendBonuses) => {
        return http.post(ApiEndpoints.APPEND_BONUSES, parameters)
    },

    resetBonuses: (parameters: TCartResetBonuses) => {
        return http.post(ApiEndpoints.RESET_BONUSES, parameters)
    },

    resetPromocode: (parameters: TCartResetPromocode) => {
        return http.post(ApiEndpoints.RESET_PROMOCODE, parameters)
    },

    selectRestaurant: (data: TCartApiSelectRestaurantRequest) => {
        return http.post(ApiEndpoints.CART_SELECT_RESTAURANT, {
            cart_id: CartService.getId(),
            type: data.orderType,
            restaurant_id: data.restaurantId,
            delivery_zone_id: data.deliveryZoneId,
        })
    },

    cancel: async () => {
        return await http.post(ApiEndpoints.ORDERS_CANCEL, {
            cart_id: CartService.getId(),
        })
    },
}
