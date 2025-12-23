import { add } from 'date-fns'

const days = [
    'вс',
    'пн',
    'вт',
    'ср',
    'чт',
    'пт',
    'сб',
]

const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
]

type TDateString = Date

export const getPrettyDayView = (dateValue: TDateString) => {
    if (dateValue.toDateString() == new Date().toDateString()) {
        return 'Сегодня'
    }

    let tomorrow_date = add(new Date(), {
        days: 1,
    })
    if (dateValue.toDateString() == tomorrow_date.toDateString()) {
        return 'Завтра'
    }

    return days[dateValue.getDay()] + ', ' + ((dateValue.getDate() < 10 ? '0' : '') + dateValue.getDate()) + ' ' + months[dateValue.getMonth()]
}