import { TDayOfWeek } from '~/types/misc'

const daysOfWeek: TDayOfWeek[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
]

export const getDayOfWeek = (date: Date = new Date()): TDayOfWeek => {
    return daysOfWeek[date.getDay()]
}
