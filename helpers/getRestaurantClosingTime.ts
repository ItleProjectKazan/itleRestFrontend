import { TLocality } from '~/types/misc'
import { getDayOfWeek } from './getDayOfWeek';

export const getRestaurantClosingTime = (locality: TLocality | null | undefined, restaurantId: number | null, date?: Date): string | undefined => {
    if (!locality) return undefined
    let restaurant = locality.restaurants.find(restaurant => {
        return restaurant.id === restaurantId
    })

    if (restaurant === undefined) {
        restaurant = locality.restaurants.find(locality => (
            locality.is_default
        )) ?? locality.restaurants[0]
    }

    if (!restaurant) return undefined
    return restaurant.opening_hours[getDayOfWeek(date)].to;
}
