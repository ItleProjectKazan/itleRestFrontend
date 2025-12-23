import { add } from 'date-fns'

const days = [
    'в воскресенье',
    'в понедельник',
    'во вторник',
    'в среду',
    'в четверг',
    'в пятницу',
    'в субботу',
]

type TDateString = Date

export const getWhenDayView = (dateValue: TDateString) => {
    if (dateValue.toDateString() == new Date().toDateString()) {
        return 'сегодня'
    }

    let tomorrow_date = add(new Date(), {
        days: 1,
    })
    if (dateValue.toDateString() == tomorrow_date.toDateString()) {
        return 'завтра'
    }

    return days[dateValue.getDay()]
}