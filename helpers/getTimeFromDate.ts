type TDateString = Date

export const getTimeFromDate = (dateTimeValue: TDateString) => {
    let delivery_time = new Date(dateTimeValue.getTime()).toLocaleTimeString('ru-RU')

    return delivery_time.substring(0, delivery_time.length - 3)
}