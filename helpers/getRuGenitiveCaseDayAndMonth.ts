import { format } from "date-fns";

const Months = {
    '1': 'января',
    '2': 'февраля',
    '3': 'марта',
    '4': 'апреля',
    '5': 'мая',
    '6': 'июня',
    '7': 'июля',
    '8': 'августа',
    '9': 'сентября',
    '10': 'октября',
    '11': 'ноября',
    '12': 'декабря',
}

export const getRuGenitiveCaseDayAndMonth = (date: Date = new Date()): string => {

    const m = format(date, 'L');

    let monthStr = ''; 

    for (const [key, value] of Object.entries(Months)) {
        if(key === m) 
            monthStr = value;
    }

    return  `${format(date, 'dd')} ${monthStr}`
}
