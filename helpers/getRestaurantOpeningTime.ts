import { TLocality } from '~/types/misc'
import { getDayOfWeek } from './getDayOfWeek';

export const getRestaurantOpeningTime = (locality: TLocality | null | undefined, restaurantId: number | null, date?: Date): string | undefined => {
    if(!locality) return undefined
    const restaurant = locality.restaurants.find(restaurant => restaurant.id === restaurantId)

    if(!restaurant) return undefined
    return restaurant.opening_hours[getDayOfWeek(date)].from;
}
