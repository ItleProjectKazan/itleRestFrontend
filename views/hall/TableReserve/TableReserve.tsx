import React, { ChangeEvent, FC, useEffect, useMemo, useState } from 'react'
import { add, isAfter, parse, sub } from 'date-fns'

import { observer } from 'mobx-react-lite'

import { usePrevious, useStore } from '~/hooks'

import { getDayOfWeek, getPrettyDayView, getRealDateString } from '~/helpers'

import { TLocality, TRestaurant } from '~/types/misc'

import { Select } from '~/components'
import styles from './TableReserve.module.scss'
import Image from 'next/legacy/image'
import { TextInput } from '~/components/Inputs/TextInput'
import { PhoneInput } from '~/components/Inputs/PhoneInput'
import { Checkbox } from '~/components'
import Link from 'next/dist/client/link'

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
    setSelectedRestaurant: (restaurant: TRestaurant | null) => void
    submitForm: () => void
    date?: Date | null

    setDate: (value: Date) => void
    setFieldValue: (name: 'date', value: any) => void
}

const TableReserve: FC<Props> = observer(
    ({
        fields,
        inputRefs,
        setOrderDate,
        setOrderTime,
        isOrdering,
        selectedRestaurant,
        locality,
        order_date,
        order_time,
        setSelectedRestaurant,
        submitForm,
        date,
        setFieldValue,
        setDate,
    }) => {
        // const date = new Date
        // const minutes = date.getMinutes()
        // const [currentMinutes, setMinutes] = useState(minutes)
        const [agree, doAgree] = useState(true)
        // const { successfullReserveModal } = useStore()

        const handleRestaurantChange = (selectedOption: TRestaurantOption) => {
            setSelectedRestaurant(selectedOption.value)
        }

        const options = useMemo(() => {
            const local_options: any = []
            locality.restaurants.map((restaurant) => {
                //if (restaurant.id !== 7 && restaurant.id !== 11) {
                local_options.push({
                    value: restaurant,
                    label: restaurant.name,
                })
                //}
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

        // useEffect(() => {
        //     const interval = setInterval(() => {
        //         const date = new Date
        //         const minutes = date.getMinutes()
        //         setMinutes(minutes)
        //     }, 60000)

        //     return () => clearInterval(interval)
        // }, [setMinutes])

        // const openingHours = selectedRestaurant!.opening_hours
        // const currentTime = useMemo(() => {
        //     return new Date()
        // }, [])
        // const todaySchedule = openingHours[getDayOfWeek(currentTime)]
        // const endTime = parse(todaySchedule.to, 'HH:mm', currentTime)
        // let startTime = currentTime
        // if (isAfter(currentTime, endTime)) {
        //     startTime = add(currentTime, {
        //         days: 1,
        //     })
        // }

        // const dateOptions = useMemo(() => {
        //     currentMinutes

        //     const local_options = []
        //     for (let i = 0; i < 8; i ++) {
        //         const date_to_select = add(startTime, {
        //             days: i,
        //         })
        //         const this_date_worktime = openingHours[getDayOfWeek(date_to_select)]

        //         let SKIP_DATE = false

        //         /// TIMES ARE EMPTY
        //         if (! this_date_worktime.from.length || ! this_date_worktime.to.length) {
        //             SKIP_DATE = true
        //         }

        //         /// TODAY TIME WITH DELIVERY IS LATER THAN RESTAURANT WORKS
        //         if (currentTime.toISOString() === date_to_select.toISOString()) {
        //             const delivery_end = sub(parse(this_date_worktime.to, 'HH:mm', date_to_select), {
        //                 minutes: 15,
        //             })

        //             if (isAfter(currentTime, delivery_end)) {
        //                 SKIP_DATE = true
        //             }
        //         }

        //         if (! SKIP_DATE && ! local_options.length) {
        //             local_options.push({
        //                 value: getRealDateString(date_to_select),
        //                 label: getPrettyDayView(date_to_select),
        //                 date: date_to_select,
        //             })
        //         }
        //     }

        //     return local_options
        // }, [currentMinutes, currentTime, openingHours, startTime])

        // const timeOptions = useMemo(() => {
        //     if (order_date) {
        //         const times = []
        //         const step = 15
        //         const useSchedule = openingHours[getDayOfWeek(order_date.date)]

        //         const start_array: any = useSchedule.from.split(':')

        //         const end_array: any = useSchedule.to.split(':')

        //         const date_start = new Date(order_date.date)

        //         // Refreshing today start time
        //         const today = new Date
        //         if (order_date.value == getRealDateString(today)) {
        //             const current_hour = today.getHours()
        //             const current_minutes = today.getMinutes()

        //             if (parseInt(start_array[0]) <= current_hour) {
        //                 start_array[0] = current_hour
        //                 if (parseInt(start_array[1]) <= current_minutes) {
        //                     start_array[1] = current_minutes
        //                 }
        //             }
        //         }

        //         let hours = parseInt(start_array[0])
        //         let minutes = parseInt(start_array[1])

        //         const temp_hours = Math.floor(minutes / 60)
        //         if (temp_hours > 0) {
        //             hours += temp_hours
        //             minutes -= temp_hours * 60
        //         }

        //         if (minutes % 15 !== 0) {
        //             if (minutes < 15) {
        //                 minutes = 15
        //             } else if (minutes < 30) {
        //                 minutes = 30
        //             } else if (minutes < 45) {
        //                 minutes = 45
        //             } else {
        //                 minutes = 0
        //                 hours ++
        //             }
        //         }

        //         date_start.setHours(hours)
        //         date_start.setMinutes(minutes)

        //         const date_end = new Date(order_date.date)
        //         date_end.setHours(end_array[0])
        //         date_end.setMinutes(end_array[1])

        //         while (date_start <= date_end) {
        //             const time = date_start.toLocaleTimeString('ru-RU', {
        //                 hour: '2-digit',
        //                 minute:'2-digit',
        //             })

        //             const label = time
        //             const asap = false

        //             times.push({
        //                 value: time,
        //                 label: label,
        //                 asap: asap,
        //             })

        //             date_start.setMinutes(date_start.getMinutes() + step)
        //         }

        //         return times
        //     }
        // }, [order_date, openingHours])

        // const selectedPrevOrderDate = usePrevious(order_date.value)
        // useEffect(() => {
        //     if (selectedPrevOrderDate !== null && selectedPrevOrderDate !== order_date.value) {
        //         if (timeOptions !== undefined) {
        //             setOrderTime(timeOptions[0])
        //         }
        //     }
        // }, [order_date.value, selectedPrevOrderDate, setOrderTime, timeOptions])

        // useEffect(() => {
        //     if (! order_date) {
        //         setOrderDate(dateOptions[0])
        //     }
        // }, [order_date, dateOptions, setOrderDate])

        // useEffect(() => {
        //     if (! order_time && timeOptions) {
        //         setOrderTime(timeOptions[0])
        //     }
        // }, [order_time, timeOptions, setOrderTime])

        return (
            <div className={styles.card}>
                <div className={styles.bg2}>
                    <Image alt='' layout='fixed' width={300} height={380} unoptimized src={'/images/hall/bg2.png'} />
                </div>
                <div className={styles.bg1}>
                    <Image alt='' layout='fixed' width={150} height={150} unoptimized src={'/images/hall/bg1.png'} />
                </div>
                {/* <Image alt="" layout="fill" unoptimized src={'/images/hall/bg1.png'}/> */}

                <div className={styles.content}>
                    <div className={styles.title}>
                        Бронируй <span>сейчас</span> свое мероприятие
                    </div>
                    <div className={styles.formBlock}>
                        {options.length > 1 && (
                            <Select
                                className={styles.restSelect}
                                instanceId='restaurant_select'
                                menuPosition='absolute'
                                menuShouldBlockScroll={false}
                                onChange={handleRestaurantChange as any}
                                options={options}
                                value={selectedRestaurantOption}
                            />
                        )}
                        <TextInput
                            className={styles.input}
                            labelClassName={styles.higherLabel}
                            {...fields.customer_name}
                            ref={(ref) => {
                                inputRefs.current.customer_name = ref
                                fields.customer_name.ref(ref)
                            }}
                            label='Ваше имя'
                            placeholder='Ваше имя'
                            width='medium'
                            type='text'
                            theme='transparent'
                            showLabel
                        />
                        <PhoneInput
                            className={styles.input}
                            labelClassName={styles.higherLabel}
                            {...fields.phone_number}
                            ref={(ref) => {
                                inputRefs.current.phone_number = ref
                                fields.phone_number.ref(ref)
                            }}
                            label='Номер телефон'
                            placeholder='Номер телефон'
                            width='medium'
                            type='phone'
                            theme='transparent'
                            showLabel
                        />
                        <TextInput
                            className={styles.input}
                            labelClassName={styles.higherLabel}
                            label='Дата мероприятия'
                            placeholder='Дата мероприятия'
                            width='medium'
                            type='date'
                            ref={(ref) => {
                                inputRefs.current.date = ref
                                fields.date.ref(ref)
                            }}
                            theme='transparent'
                            onChange={(e: any) => {
                                const value = e.target.value
                                setFieldValue('date', value)
                                setDate(value)
                            }}
                            value={date}
                            showLabel
                        />
                    </div>

                    <div className={styles.reserveBlock}>
                        <button
                            className={styles.orderButton}
                            disabled={!agree || isOrdering ? true : false}
                            // loading={ isOrdering }
                            onClick={submitForm}
                            // size="large"
                        >
                            Забронировать
                        </button>

                        <Checkbox
                            checked={agree}
                            className={styles.agreementCheckbox}
                            inline
                            label={
                                <div className={styles.checkboxLabel}>
                                    Согласие с{' '}
                                    <Link href='/info/legal' target='_blank'>
                                        политикой конфиденциальности
                                    </Link>
                                </div>
                            }
                            onChange={(checked: boolean) => {
                                doAgree(checked)
                            }}
                        />

                        {/* {successfullReserveModal.isOpen && <SuccessfullReserveModal />} */}
                    </div>
                </div>
            </div>
        )
    },
)

export { TableReserve }
