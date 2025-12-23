import Joi from 'joi'

import { TSelectedRestaurantInfo } from '~/types/misc'

export const parseRestaurantCookie = (restaurantCookie: string): TSelectedRestaurantInfo | null => {
    try {
        const value = JSON.parse(restaurantCookie)
        const schema = Joi.object({
            id: Joi.number(),
            delivery_zone_id: Joi.number(),
            delivery_details: Joi.object({
                address: Joi.string(),
                street: Joi.string(),
                locality: Joi.string(),
                province: Joi.string(),
                house: Joi.string(),
                coords: Joi.object({
                    latitude: Joi.number(),
                    longitude: Joi.number(),
                }),
                apartment: Joi.string().allow(''),
                door_code: Joi.string().allow(''),
                porch: Joi.string().allow(''),
                floor: Joi.string().allow(''),
            }).allow(null),
        })

        const { error } = schema.validate(value)
        if (error !== undefined) {
            return null
        }

        return value
    } catch (error) {
        console.error(error)
        return null
    }
}
