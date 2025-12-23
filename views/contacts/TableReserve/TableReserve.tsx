import React, { FC, useEffect, useMemo, useState } from 'react'
import { add, isAfter, parse, sub } from 'date-fns'

import Link from 'next/link'
import { observer } from 'mobx-react-lite'

import { useQuery } from 'react-query'

import { usePrevious, useStore } from '~/hooks'

import { Select } from '~/components/Select/Select'
import { SuccessfullReserveModal } from './SuccessfullReserveModal'
import { getCategories } from '~/services/queries'

import { Button, Checkbox, Counter, PhoneInput, TextInput, TextAreaInput, Typography } from '~/components'

import { getDayOfWeek, getPrettyDayView, getRealDateString } from '~/helpers'

import { TLocality, TRestaurant } from '~/types/misc'
import { TCategory } from '~/types/catalog'

import styles from './TableReserve.module.scss'

// use a constant to have memoized value
// to prevent rerenders
const DEFAULT_EMPTY_LIST = [] as const

const QUERY_KEYS = {
    BANNERS: (restaurantId: number | undefined) => ['banners', restaurantId],
    CATEGORIES: (restaurantId: number | undefined) => ['categories', restaurantId],
    POPULAR_PRODUCTS: (restaurantId: number | undefined) => ['popular-products', restaurantId],
    PRODUCTS: (restaurantId: number | undefined) => ['products', restaurantId],
}

type TRestaurantOption = {
    value: TRestaurant
    label: string
}

type TDatetimeDate = {
    value: string
    label: string
    date: Date
}

type TDatetimeTime = {
    value: string
    label: string
}

interface Props {
    fields: Record<keyof any, any>
    formData: any
    formErrors: any
    isOrdering: boolean
    setOrderDate: (selectedDate: TDatetimeDate) => void
    setOrderTime: (selectedTime: TDatetimeTime) => void
    inputRefs: any
    selectedRestaurant: TRestaurant | null
    locality: TLocality
    order_date: TDatetimeDate
    order_time: TDatetimeTime
    people_count: number
    setSelectedRestaurant: (restaurant: TRestaurant | null) => void
    setPeopleCount: (value: number) => void
    setFieldValue: (name: 'people_count', value: number) => void
    submitForm: () => void
}

const TableReserve: FC<Props> = observer(
    ({
        fields,
        formErrors,
        inputRefs,
        isOrdering,
        setOrderDate,
        setOrderTime,
        selectedRestaurant,
        setFieldValue,
        locality,
        order_date,
        order_time,
        people_count,
        setPeopleCount,
        setSelectedRestaurant,
        submitForm,
    }) => {
        const date = new Date()
        const minutes = date.getMinutes()
        const [currentMinutes, setMinutes] = useState(minutes)
        const [agree, doAgree] = useState(true)
        const { successfullReserveModal } = useStore()

        const categories =
            useQuery<TCategory[]>(
                QUERY_KEYS.CATEGORIES(selectedRestaurant?.id),
                () => getCategories(selectedRestaurant?.id),
                {
                    refetchOnWindowFocus: false,
                    // use cached data if it cached less than 10 minutes ago
                    // staleTime: 10 * 60 * 1000,
                },
            ).data ?? (DEFAULT_EMPTY_LIST as any as TCategory[])

        const handleRestaurantChange = (selectedOption: TRestaurantOption) => {
            setSelectedRestaurant(selectedOption.value)
        }

        const options = useMemo(() => {
            let local_options: any = []
            locality.restaurants.map((restaurant) => {
                local_options.push({
                    value: restaurant,
                    label: restaurant.name,
                })
            })

            return local_options
        }, [locality])

        const selectedRestaurantOption = useMemo(() => {
            if (!selectedRestaurant) {
                return null
            }

            return {
                value: selectedRestaurant,
                label: selectedRestaurant.name,
            }
        }, [selectedRestaurant])

        useEffect(() => {
            const interval = setInterval(() => {
                const date = new Date()
                const minutes = date.getMinutes()
                setMinutes(minutes)
            }, 60000)

            return () => clearInterval(interval)
        }, [setMinutes])

        const openingHours = selectedRestaurant!.opening_hours
        const currentTime = useMemo(() => {
            return new Date()
        }, [])
        const todaySchedule = openingHours[getDayOfWeek(currentTime)]
        const endTime = parse(todaySchedule.to, 'HH:mm', currentTime)
        let startTime = currentTime

        const checkCurrentTime = add(currentTime, {
            minutes: 45,
        })

        if (isAfter(checkCurrentTime, endTime)) {
            startTime = add(currentTime, {
                days: 1,
            })
        }

        const start_reserve_time = useMemo(() => {
            const defaultStartTime = '15:00'
            for (let i = 0; i < categories.length; i++) {
                if (categories[i].code == 'business-lunch') {
                    if (categories[i].availability_schedule !== null) {
                        const todaySchedule = categories[i].availability_schedule[getDayOfWeek(startTime)]
                        if (todaySchedule !== null) {
                            return todaySchedule[0].to < defaultStartTime
                                ? defaultStartTime
                                : todaySchedule[0].to < '17:00'
                                  ? todaySchedule[0].to
                                  : '17:00'
                        }
                    }
                }
            }

            return defaultStartTime
        }, [categories, startTime])

        const dateOptions = useMemo(() => {
            currentMinutes

            let local_options = []
            local_options.push({
                value: getRealDateString(startTime),
                label: getPrettyDayView(startTime),
                date: startTime,
            })

            return local_options
        }, [currentMinutes, startTime])

        const timeOptions = useMemo(() => {
            if (order_date) {
                let today = new Date()
                const times = []
                const step = 15

                if (order_date.value == getRealDateString(today)) {
                    const useSchedule = openingHours[getDayOfWeek(order_date.date)]

                    const start_array: any =
                        useSchedule.from > start_reserve_time
                            ? useSchedule.from.split(':')
                            : start_reserve_time.split(':')

                    const end_array: any = useSchedule.to.split(':')

                    const date_start = new Date(order_date.date)

                    // Refreshing today start time
                    if (order_date.value == getRealDateString(today)) {
                        let current_hour = today.getHours()
                        let current_minutes = today.getMinutes()

                        if (parseInt(start_array[0]) <= current_hour) {
                            start_array[0] = current_hour
                            if (parseInt(start_array[1]) <= current_minutes) {
                                start_array[1] = current_minutes
                            }
                        }
                    }

                    let hours = parseInt(start_array[0])
                    let minutes = parseInt(start_array[1])

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

                    const date_end = new Date(order_date.date)
                    date_end.setHours(end_array[0])
                    date_end.setMinutes(end_array[1])

                    let use_date_end = date_end
                    if (selectedRestaurant?.kitchen_diff) {
                        use_date_end = sub(use_date_end, {
                            minutes: parseInt(selectedRestaurant?.kitchen_diff) + 15,
                        })
                    }

                    // const use_date_end = sub(date_end, {
                    //     minutes: 30,
                    // })

                    while (date_start <= use_date_end) {
                        const time = date_start.toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })

                        let label = time
                        let asap = false

                        times.push({
                            value: time,
                            label: label,
                            asap: asap,
                        })

                        date_start.setMinutes(date_start.getMinutes() + step)
                    }
                }

                return times
            }
        }, [order_date, openingHours, selectedRestaurant, start_reserve_time])

        const selectedPrevOrderDate = usePrevious(order_date.value)
        useEffect(() => {
            if (selectedPrevOrderDate !== null && selectedPrevOrderDate !== order_date.value) {
                if (timeOptions !== undefined) {
                    setOrderTime(timeOptions[0])
                }
            }
        }, [order_date.value, selectedPrevOrderDate, setOrderTime, timeOptions])

        useEffect(() => {
            if (!order_date) {
                setOrderDate(dateOptions[0])
            }
        }, [order_date, dateOptions, setOrderDate])

        useEffect(() => {
            if (!order_time && timeOptions) {
                setOrderTime(timeOptions[0])
            }
        }, [order_time, timeOptions, setOrderTime])

        const selectedPrevReservTime = usePrevious(start_reserve_time)
        useEffect(() => {
            if (selectedPrevReservTime !== start_reserve_time && timeOptions) {
                setOrderTime(timeOptions[0])
            }
        }, [start_reserve_time, selectedPrevReservTime, timeOptions, setOrderTime])

        const unavailableToday = useMemo(() => {
            if (!timeOptions || timeOptions.length == 0) {
                return true
            }

            let today = dateOptions[0].value
            let forbiddenDates = ['2023-03-08']

            if (forbiddenDates.includes(today) || (today >= '2023-03-24' && today < '2023-04-22')) {
                return true
            }

            return false
        }, [timeOptions, dateOptions])

        return (
            <div>
                <h2 className={styles.title}>Забронировать столик</h2>
                {unavailableToday ? (
                    <Typography color='error' lineHeight={18} size={16}>
                        К сожалению, на сегодня забронировать столик нет возможности
                    </Typography>
                ) : (
                    <>
                        <div className={styles.formBlock}>
                            {options.length > 1 && (
                                <div>
                                    <Typography className={styles.formBlockHeader} lineHeight={25} size={20}>
                                        Выберите ресторан
                                    </Typography>
                                    <div>
                                        <Select
                                            instanceId='restaurant_select'
                                            menuPosition='absolute'
                                            menuShouldBlockScroll={false}
                                            onChange={handleRestaurantChange as any}
                                            options={options}
                                            value={selectedRestaurantOption}
                                        />
                                    </div>
                                </div>
                            )}
                            <TextInput
                                {...fields.customer_name}
                                ref={(ref) => {
                                    inputRefs.current.customer_name = ref
                                    fields.customer_name.ref(ref)
                                }}
                                className={styles.inputBlock}
                                error={formErrors.customer_name !== undefined}
                                fullWidth
                                placeholder='Ваше имя'
                            />

                            <PhoneInput
                                {...fields.phone_number}
                                ref={(ref) => {
                                    inputRefs.current.phone_number = ref
                                    fields.phone_number.ref(ref)
                                }}
                                className={styles.inputBlock}
                                error={formErrors.phone_number !== undefined}
                                fullWidth
                                placeholder='Ваш телефон'
                            />
                        </div>

                        <div className={styles.formBlock}>
                            <Typography className={styles.formBlockHeader} lineHeight={25} size={20}>
                                Количество персон
                            </Typography>
                            <Counter
                                ref={(ref) => {
                                    inputRefs.current.people_count = ref
                                    fields.people_count.ref(ref)
                                }}
                                max={15}
                                min={1}
                                onChange={(value: number) => {
                                    setFieldValue('people_count', value)
                                    setPeopleCount(value)
                                }}
                                value={people_count}
                            />
                        </div>

                        <div className={styles.formBlock}>
                            <Typography className={styles.formBlockHeader} lineHeight={25} size={20}>
                                Дата: {dateOptions[0].label}
                            </Typography>
                            {/*<div>
                                <Select
                                    instanceId="delivery_date"
                                    menuPosition="absolute"
                                    menuShouldBlockScroll={ false }
                                    onChange={ setOrderDate as any }
                                    options={ dateOptions }
                                    value={ order_date }
                                />
                            </div> */}
                        </div>

                        <div className={styles.formBlock}>
                            <Typography className={styles.formBlockHeader} lineHeight={25} size={20}>
                                Время
                            </Typography>
                            <div className={styles.timeSelectBlock}>
                                <Select
                                    instanceId='delivery_time'
                                    menuPosition='absolute'
                                    menuShouldBlockScroll={false}
                                    onChange={setOrderTime as any}
                                    options={timeOptions}
                                    value={order_time}
                                />
                            </div>
                            <TextAreaInput
                                {...fields.comment}
                                ref={(ref) => {
                                    inputRefs.current.comment = ref
                                    fields.comment.ref(ref)
                                }}
                                className={styles.inputBlock}
                                error={formErrors.comment !== undefined}
                                fullWidth
                                numberoflines={5}
                                placeholder='Есть пожелания?'
                                rows={5}
                            />
                        </div>

                        <div className={styles.formBlock}>
                            <Checkbox
                                checked={agree}
                                className={styles.agreementCheckbox}
                                inline
                                label={
                                    <div className={styles.checkboxLabel}>
                                        Я соглашаюсь на обработку персональных данных и с условиями{' '}
                                        <Link target='_blank' href='/info/legal'>
                                            Политики конфиденциальности
                                        </Link>
                                    </div>
                                }
                                onChange={(checked: boolean) => {
                                    doAgree(checked)
                                }}
                            />
                        </div>
                        <Button
                            className={styles.orderButton}
                            disabled={!agree ? true : false}
                            fullWidth
                            loading={isOrdering}
                            onClick={submitForm}
                            size='large'
                        >
                            Забронировать
                        </Button>
                        {successfullReserveModal.isOpen && <SuccessfullReserveModal />}
                    </>
                )}
            </div>
        )
    },
)

export { TableReserve }
