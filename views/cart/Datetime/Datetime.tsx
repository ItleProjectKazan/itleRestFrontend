import React, { FC, useEffect, useMemo, useState } from 'react'
import { add, sub, isAfter, parse } from 'date-fns'
import { Typography } from '~/components'
import { getDayOfWeek, getPrettyDayView, getRealDateString } from '~/helpers'
import { useCurrentRestaurant, useCart, usePrevious } from '~/hooks'
import { Select } from '~/components/Select/Select'
import { FormGroup } from '~/components'
import { DeliveryDateInfo } from './DeliveryDateInfo'
import { TOrderType } from '~/types/order'
import styles from './Datetime.module.scss'

type TDatetimeDate = {
    value: string
    label: string
    date: Date
}

type TDatetimeTime = {
    value: string
    label: string
}

export type DatetimeHandle = {
    delivery_date: TDatetimeDate
    delivery_time: TDatetimeTime
    orderType: string
    deliveryZoneId?: number | null
    setDeliveryDate: (selectedDate: TDatetimeDate) => void
    setDeliveryTime: (selectedTime: TDatetimeTime) => void
}

const Datetime: FC<DatetimeHandle> = ({
    delivery_date,
    delivery_time,
    orderType,
    deliveryZoneId,
    setDeliveryDate,
    setDeliveryTime,
}) => {
    const date = new Date()
    const minutes = date.getMinutes()
    const restaurant = useCurrentRestaurant()
    const cart = useCart()

    const [currentMinutes, setMinutes] = useState(minutes)
    const [skipFirstDate, doSkipFirstDate] = useState(false)

    const [dateSelectRef, setDateSelectRef] = useState<HTMLElement | null>(null)
    const [dateSelectMessagePopupOpen, setDateSelectMessage] = useState(false)
    const [dateMessageShown, setDateMessageShown] = useState(false)

    const openingHours = restaurant!.opening_hours
    const currentTime = useMemo(() => {
        return new Date()
    }, [])
    const todaySchedule = openingHours[getDayOfWeek(currentTime)]
    const endTime = parse(todaySchedule.to, 'HH:mm', currentTime)

    let startTime = currentTime
    if (isAfter(currentTime, endTime)) {
        startTime = add(currentTime, {
            days: 1,
        })
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const date = new Date()
            const minutes = date.getMinutes()
            setMinutes(minutes)
        }, 60000)

        return () => clearInterval(interval)
    }, [setMinutes])

    const options = useMemo(() => {
        currentMinutes

        const local_options = []
        for (let i = 0; i < 4; i++) {
            const date_to_select = add(startTime, {
                days: i,
            })
            const this_date_worktime = openingHours[getDayOfWeek(date_to_select)]

            let SKIP_DATE = false

            /// TIMES ARE EMPTY
            if (!this_date_worktime.from.length || !this_date_worktime.to.length) {
                SKIP_DATE = true

                /// SET POPOVER IF TODAY IS EMPTY
                if (currentTime.toDateString() === date_to_select.toDateString() && !dateMessageShown) {
                    setDateSelectMessage(true)
                    setDateMessageShown(true)
                }
            }

            /// TODAY TIME WITH DELIVERY IS LATER THAN RESTAURANT WORKS
            if (currentTime.toDateString() === date_to_select.toDateString()) {
                const datetime_with_delivery = add(currentTime, {
                    minutes: 0, ///cart.deliveryZone ? cart.deliveryZone.delivery_time : 0,
                })
                const delivery_end = parse(this_date_worktime.to, 'HH:mm', date_to_select)

                if (isAfter(datetime_with_delivery, delivery_end)) {
                    SKIP_DATE = true

                    /// SET POPOVER IF TODAY IS EMPTY
                    if (currentTime.toDateString() === date_to_select.toDateString() && !dateMessageShown) {
                        setDateSelectMessage(true)
                        setDateMessageShown(true)
                    }
                }

                if (skipFirstDate) {
                    SKIP_DATE = true
                }
            }

            if (!SKIP_DATE) {
                local_options.push({
                    value: getRealDateString(date_to_select),
                    label: getPrettyDayView(date_to_select),
                    date: date_to_select,
                })
            }
        }

        return local_options
    }, [
        skipFirstDate,
        cart,
        currentMinutes,
        currentTime,
        dateMessageShown,
        openingHours,
        startTime,
        setDateMessageShown,
        setDateSelectMessage,
    ])

    const prevOptions = usePrevious(options)
    useEffect(() => {
        if (!delivery_date) {
            setDeliveryDate(options[0])
        }
    }, [cart.type, delivery_date, prevOptions, options, setDeliveryDate])

    useEffect(() => {
        if (JSON.stringify(prevOptions) !== JSON.stringify(options)) {
            setDeliveryDate(options[0])
        }
    }, [skipFirstDate, options, setDeliveryDate])

    useEffect(() => {
        if (options[0].date.toDateString() !== new Date().toDateString() && !dateMessageShown) {
            /// SET POPOVER IF TODAY IS EMPTY
            setDateSelectMessage(true)
            setDateMessageShown(true)
        }
    }, [dateMessageShown, options, setDateMessageShown, setDateSelectMessage])


    const options2 = useMemo(() => {
        if (delivery_date) {
            const times = []
            const step = 15
            const useSchedule = openingHours[getDayOfWeek(delivery_date.date)]
            let start_array: any = useSchedule.from.split(':')

            if (orderType == TOrderType.DELIVERY) {
                const currentDeliveryZone = restaurant?.delivery_zones.find(({ id }) => id === deliveryZoneId)
                const deliveryZoneOpeningHours = currentDeliveryZone?.opening_hours[getDayOfWeek(delivery_date.date)][0]
                const deliveryZoneStartArray = deliveryZoneOpeningHours?.from.split(':')
                   
                if (deliveryZoneStartArray) {
                    if (deliveryZoneStartArray[0] > start_array[0]) {
                        start_array = deliveryZoneStartArray
                    } else if (
                        deliveryZoneStartArray[0] === start_array[0] &&
                        deliveryZoneStartArray[1] > start_array[1]
                    ) {
                        start_array = deliveryZoneStartArray
                    }
                }
            }

            let hours_to_add = 0
            let minutes_to_add = 0

            /// DELIVERY ///
            let temp_minutes: any = 0 //cart.deliveryZone ? cart.deliveryZone.delivery_time : 0

            if (temp_minutes > 60) {
                hours_to_add = Math.floor(temp_minutes / 60)
                minutes_to_add = temp_minutes - hours_to_add * 60
            } else {
                minutes_to_add = temp_minutes
            }

            const date_start = new Date(delivery_date.date)

            // Refreshing today start time
            const today = new Date()
            if (delivery_date.value == getRealDateString(today)) {
                const current_hour = today.getHours()
                const current_minutes = today.getMinutes()

                if (parseInt(start_array[0]) <= current_hour) {
                    start_array[0] = current_hour
                    if (parseInt(start_array[1]) <= current_minutes) {
                        start_array[1] = current_minutes
                    }
                }
            }

            let hours = parseInt(start_array[0]) + hours_to_add
            let minutes = parseInt(start_array[1]) + minutes_to_add

            let temp_hours = Math.floor(minutes / 60)
            
            if (temp_hours > 0) {
                hours += temp_hours
                minutes -= temp_hours * 60
            }
        


            if (minutes % 15 !== 0) {
                if (minutes < 15) {
                    minutes = 15
                } else if (minutes < 30) {
                    minutes = 30
                } else if (minutes < 45) {
                    minutes = 45
                } else {
                    minutes = 0
                    hours++
                }
            }

            date_start.setHours(hours)
            date_start.setMinutes(minutes)

            /// COOKING
            hours_to_add = 0
            minutes_to_add = 0

            temp_minutes = 0 //cart.deliveryZone ? cart.deliveryZone.cooking_time : 0

            if (temp_minutes > 60) {
                hours_to_add = Math.floor(temp_minutes / 60)
                minutes_to_add = temp_minutes - hours_to_add * 60
            } else {
                minutes_to_add = temp_minutes
            }

            hours = hours_to_add
            minutes = minutes_to_add

            temp_hours = Math.floor(minutes / 60)
            if (temp_hours > 0) {
                hours += temp_hours
                minutes -= temp_hours * 60
            }

            const cooking_date = new Date(delivery_date.date)

            const cooking_done: any = add(cooking_date, {
                hours: hours,
                minutes: minutes,
            })

            let express_date_end: any = false
            const date_end = new Date(delivery_date.date)
            const end_array: any = useSchedule.to.split(':')
            date_end.setHours(end_array[0])
            date_end.setMinutes(end_array[1])

            let use_date_end = date_end
            if (restaurant?.kitchen_diff) {
                use_date_end = sub(use_date_end, {
                    minutes: parseInt(restaurant?.kitchen_diff),
                })
            }

            if (delivery_date.value == getRealDateString(today)) {
                if (restaurant?.express_minutes_before_close) {
                    express_date_end = sub(date_end, {
                        minutes: parseInt(restaurant?.express_minutes_before_close),
                    })
                }
            }

            let option_key = 0
            if (express_date_end && express_date_end <= date_start && orderType == TOrderType.DELIVERY) {
                if (cooking_done <= use_date_end) {
                    const time = date_start.toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })
                    times.push({
                        value: time,
                        label: 'Как можно скорее',
                        asap: true,
                    })
                } else {
                    doSkipFirstDate(true)
                }
            } else {
                while (date_start <= use_date_end) {
                    const time = date_start.toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })

                    let label = time
                    let asap = false
                    if (delivery_date.value == getRealDateString(today)) {
                        if (option_key == 0) {
                            label = 'Как можно скорее'
                            asap = true
                        }
                    }

                    times.push({
                        value: time,
                        label: label,
                        asap: asap,
                    })

                    date_start.setMinutes(date_start.getMinutes() + step)
                    option_key++
                }
            }

            if (delivery_date.value == getRealDateString(today)) {
                if (!times.length && !skipFirstDate) {
                    doSkipFirstDate(true)
                }
            }

            return times
        }
    }, [
        cart.deliveryZone,
        cart.type,
        delivery_date,
        openingHours,
        orderType,
        doSkipFirstDate,
        skipFirstDate,
        restaurant,
    ])

    useEffect(() => {
        if (!delivery_time && options2 && options2.length > 1) {
            setDeliveryTime(options2[0])
        }
    }, [delivery_time, doSkipFirstDate, options2, setDeliveryTime])

    useEffect(() => {
        if (options2 && options2.length > 1) {
            setDeliveryTime(options2[0])
        }
    }, [deliveryZoneId, options2, setDeliveryTime])

    const prevDate = usePrevious(delivery_date)
    useEffect(() => {
        if (delivery_date !== prevDate && options2) {
            setDeliveryTime(options2[0])
        }
    }, [delivery_date, prevDate, options2, setDeliveryTime])

    useEffect(() => {
        if (options2?.length) {
            setDeliveryTime(options2[0])
        }
    }, [orderType, options2])

    const handleDateChange = (selectedOption: TDatetimeDate) => {
        setDeliveryDate(selectedOption)
    }

    const handleTimeChange = (selectedOption: TDatetimeTime) => {
        setDeliveryTime(selectedOption)
    }

    ///const delivery_string = (orderType == TOrderType.DELIVERY) ? 'доставки' : 'самовывоза'

    return (
        <div>
            <FormGroup className={styles.deliveryFields}>
                <Typography className='checkout-page__content-title'>Дата</Typography>
                <Typography className='checkout-page__content-title checkout-page__content-title--red'>
                    Время
                </Typography>
                <div ref={setDateSelectRef} className={styles.selectHolder}>
                    <Select
                        instanceId='delivery_date'
                        menuPosition='absolute'
                        menuShouldBlockScroll={false}
                        onChange={handleDateChange as any}
                        options={options}
                        value={delivery_date}
                    />
                </div>
                {dateSelectMessagePopupOpen ? (
                    <DeliveryDateInfo
                        anchorRef={dateSelectRef}
                        date={options[0].label}
                        onClose={() => setDateSelectMessage(false)}
                    />
                ) : (
                    false
                )}
                <div className={styles.selectHolder}>
                    <Select
                        instanceId='delivery_time'
                        menuPosition='absolute'
                        menuShouldBlockScroll={false}
                        onChange={handleTimeChange as any}
                        options={options2}
                        value={delivery_time}
                    />
                </div>
            </FormGroup>
        </div>
    )
}

Datetime.displayName = 'Datetime'

export { Datetime }
