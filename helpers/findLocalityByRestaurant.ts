import { TLocality } from '~/types/misc'

export const findLocalityByRestaurant = (localities: TLocality[], restaurantId: number): TLocality | undefined => {
    return localities.find(locality => {
        const restaurant = locality.restaurants.find(restaurant => restaurant.id === restaurantId)

        return restaurant !== undefined
    })
}
