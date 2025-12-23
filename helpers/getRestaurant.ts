import { TLocality } from '~/types/misc'
import { http } from '~/core/axios'
import { ApiEndpoints } from '~/constants/apiEndpoints'
import { TRestaurant } from '~/types/misc'

export const getRestaurant = async (id?: number): Promise<TRestaurant | null> => {
    const localities = (await http.get<TLocality[]>(ApiEndpoints.RESTAURANTS)).data
    const locality = localities.find((locality) => locality.is_default)
    if (!locality || locality.restaurants.length === 0) return null
    if (id) {
        const restaurant = locality.restaurants.find((restaurant) => restaurant.id === id)
        if (restaurant) {
            return restaurant
        }
    }
    const restaurant = locality.restaurants.find((restaurant) => restaurant.is_default) ?? locality.restaurants[0]

    return restaurant
}
export const findRestaurant = async (id?: number): Promise<TRestaurant | null> => {
    const localities = (await http.get<TLocality[]>(ApiEndpoints.RESTAURANTS)).data
    const locality = localities.find((locality) => locality.is_default)
    if (!locality || locality.restaurants.length === 0) return null
    if (id) {
        const restaurant = locality.restaurants.find((restaurant) => restaurant.id === id)
        if (restaurant) {
            return restaurant
        }
    }
    return null
}
