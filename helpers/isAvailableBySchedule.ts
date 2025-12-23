import { isAfter, isBefore, parse } from 'date-fns'

import { getDayOfWeek } from '~/helpers'

import { TCategory } from '~/types/catalog'

export const isAvailableBySchedule = (category: TCategory) => {
    if (category === null || category == undefined) {
        return true
    }

    if (category.availability_schedule === null) {
        return true
    }

    const currentTime = new Date()
    const todaySchedule = category.availability_schedule[getDayOfWeek()]

    if (todaySchedule === null) {
        return false
    }

    return todaySchedule.reduce((show, period) => {
        const startTime = parse(period.from, 'HH:mm', currentTime)
        const endTime = parse(period.to, 'HH:mm', currentTime)

        return show && isAfter(currentTime, startTime) && isBefore(currentTime, endTime)
    }, true)
}
