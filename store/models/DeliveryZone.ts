import { Instance, types } from 'mobx-state-tree'

export const DaySchedule = types.model('RestaurantDaySchedule', {
    from: types.string,
    to: types.string,
})

export const OpeningHours = types.model('OpeningHours', {
    monday: types.array(DaySchedule),
    tuesday: types.array(DaySchedule),
    wednesday: types.array(DaySchedule),
    thursday: types.array(DaySchedule),
    friday: types.array(DaySchedule),
    saturday: types.array(DaySchedule),
    sunday: types.array(DaySchedule),
})

export type TDeliveryZone = Instance<typeof DeliveryZone>

export const DeliveryZone = types.model({
    id: types.number,
    type: types.string,
    name: types.string,
    price: types.number,
    min_delivery_price: types.maybeNull(types.number),
    free_delivery_price: types.maybeNull(types.number),
    area: types.maybeNull(types.array(types.array(types.number))),
    cooking_time: types.number,
    transportation_time: types.number,
    delivery_time: types.number,
    opening_hours: OpeningHours,
})
