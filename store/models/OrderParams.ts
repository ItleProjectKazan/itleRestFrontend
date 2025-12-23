import { getEnv, Instance, types } from 'mobx-state-tree'

import { findLocalityByRestaurant } from '~/helpers'
import { Restaurant } from '~/store/models/Restaurant'
import { SettingsService } from '~/services/settingsService'

import { TLocality, TSelectedRestaurantInfo } from '~/types/misc'
import { TOrderType, TPaymentMethod } from '~/types/order'

export type TDeliveryDetails = Instance<typeof DeliveryDetails>
export type TOrderParams = Instance<typeof OrderParams>

export const DeliveryDetails = types.model('DeliveryDetails', {
    address: types.string,
    street: types.maybeNull(types.string),
    locality: types.maybeNull(types.string),
    house: types.maybeNull(types.string),
    province: types.maybeNull(types.string),
    coords: types.model({
        latitude: types.number,
        longitude: types.number,
    }),
    apartment: types.maybeNull(types.string),
    door_code: types.maybeNull(types.string),
    porch: types.maybeNull(types.string),
    floor: types.maybeNull(types.string),
})

export const OrderParams = types
    .model('OrderParams', {
        orderType: types.string,
        localityId: types.maybeNull(types.number),
        restaurantId: types.maybeNull(types.number),
        deliveryZoneId: types.maybeNull(types.number),
        deliveryDetails: types.maybeNull(DeliveryDetails),
        paymentMethod: types.maybeNull(types.string),
    })
    .actions((self) => ({
        setPaymentMethod(type: TPaymentMethod) {
            self.paymentMethod = type
            SettingsService.set('payment_method', type)
        },
        setDeliveryZoneId(id: number | null) {
            self.deliveryZoneId = id
            SettingsService.set('delivery_zone_id', id)
        },
        setRestaurant: function (
            type: TOrderType,
            restaurant: Omit<TSelectedRestaurantInfo, 'delivery_zone_id'> & {
                delivery_zone_id: number | null
            },
        ) {
            const localities = getEnv(self).localities as TLocality[]
            const localityId =
                restaurant.id !== null ? (findLocalityByRestaurant(localities, restaurant.id)?.id ?? null) : null

            self.orderType = type
            self.localityId = localityId
            self.restaurantId = restaurant.id
            self.deliveryZoneId = restaurant.delivery_zone_id
            self.deliveryDetails = restaurant.delivery_details ?? null

            // reset the payment method when changing order type
            ;(self as any).setPaymentMethod(TPaymentMethod.CARD_ONLINE)
        },
    }))
    .views((self) => ({
        get address() {
            return self.orderType === TOrderType.DELIVERY
                ? self.deliveryDetails?.address
                : (self as any).restaurant?.address
        },
        get restaurant() {
            const localities = getEnv(self).localities as TLocality[]
            const restaurant = localities
                .find((locality) => locality.id === self.localityId)
                ?.restaurants.find((restaurant) => restaurant.id === self.restaurantId)

            return restaurant !== undefined ? Restaurant.create(restaurant) : null
        },
    }))
