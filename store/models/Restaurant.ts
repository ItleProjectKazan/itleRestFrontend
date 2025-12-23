import { Instance, types } from 'mobx-state-tree'
import { isAfter, isBefore, parse } from 'date-fns'

import { getDayOfWeek } from '~/helpers'

import { DeliveryZone } from '~/store/models/DeliveryZone'

export type TRestaurant = Instance<typeof Restaurant>
export type TOpeningHours = Instance<typeof OpeningHours>

export const DaySchedule = types.model('RestaurantDaySchedule', {
    from: types.string,
    to: types.string,
})

export const OpeningHours = types.model('OpeningHours', {
    monday: DaySchedule,
    tuesday: DaySchedule,
    wednesday: DaySchedule,
    thursday: DaySchedule,
    friday: DaySchedule,
    saturday: DaySchedule,
    sunday: DaySchedule,
})

export const OpeningHoursBooking = types.model('OpeningHoursBooking', {
    monday: types.maybeNull(DaySchedule),
    tuesday: types.maybeNull(DaySchedule),
    wednesday: types.maybeNull(DaySchedule),
    thursday: types.maybeNull(DaySchedule),
    friday: types.maybeNull(DaySchedule),
    saturday: types.maybeNull(DaySchedule),
    sunday: types.maybeNull(DaySchedule),
})

export const Restaurant = types
    .model('Restaurant', {
        id: types.identifierNumber,
        name: types.string,
        address: types.string,
        accepts_online_payments: types.maybeNull(types.boolean),
        is_default: types.boolean,
        latitude: types.number,
        longitude: types.number,
        delivery_radius: types.maybeNull(types.number),
        opening_hours: OpeningHours,
        phone_number: types.maybeNull(types.string),
        delivery_zones: types.array(DeliveryZone),
        express_minutes_before_close: types.maybeNull(types.string),
        kitchen_diff: types.maybeNull(types.string),
        schedule_modal: types.model({
            is_default_title: types.boolean,
            text: types.maybeNull(types.string),
            title: types.maybeNull(types.string),
        }),
        booking_config: types.model({
            is_booking_schedule: types.boolean,
            is_booking_disable: types.boolean,
            booking_hours: OpeningHoursBooking,
        }),
    })
    .views((self) => ({
        get isOpen() {
            const daySchedule = self.opening_hours[getDayOfWeek()]
            const currentTime = new Date()
            const startTime = parse(daySchedule.from, 'HH:mm', currentTime)
            const endTime = parse(daySchedule.to, 'HH:mm', currentTime)
            // const startTime = parse(daySchedule[0], 'HH:mm', currentTime)
            // const endTime = parse(daySchedule[0], 'HH:mm', currentTime)

            return isAfter(currentTime, startTime) && isBefore(currentTime, endTime)
        },
    }))
