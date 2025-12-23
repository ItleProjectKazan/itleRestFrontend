import React, { FC, useRef, useEffect, useReducer, useMemo, ChangeEvent, useState, FormEvent } from 'react'
import { observer } from 'mobx-react-lite'
import { format, addDays } from 'date-fns'
import { Modal } from '~/components'
import { Button, Typography, TextInput, PhoneInput, TextAreaInput, Checkbox } from '~/components'
import styles from './BookingModal.module.scss'
import { Select } from '~/components/Select/Select'
import { useStore } from '~/hooks'
import { TRestaurant } from '~/types/misc'
import { getDayOfWeek, normalizePhone } from '~/helpers'
import { ApiEndpoints } from '~/constants/apiEndpoints'
import { http } from '~/core/axios'
import { validate } from './validate'
import { ru } from 'date-fns/locale'
import Link from 'next/link'
import { Loader } from '~/components'
import { addYm } from '~/helpers'

interface IBookingModal {
    onClose: () => void
    open: boolean
}

export type TFormData = {
    name: string
    phone_number: string
    person_count: number
    restaurant: TRestaurant | null
    order_time: string
    order_date: Date
    comment?: string | null
}

//eslint-disable-next-line
export type TFormDataError = { [keys in keyof TFormData]?: string }

type TOptionTime = {
    label: string
    value: string
}
type TOptionDate = {
    label: string
    value: Date
}
type TOptionTRestaurant = {
    label: string
    value: TRestaurant
}

const BookingModal: FC<IBookingModal> = observer(({ onClose, open }) => {
    const today = new Date()
    const daysCount: number = 0 //Количество дополнительных дней в календаре
    const modalRef = useRef<HTMLElement | null>(null)
    const { localities, user, successfullReserveModal, bookingModal } = useStore()
    const locality = localities.find((locality) => locality.is_default) ?? localities[0]
    const [timeOptions, setTimeOptions] = useState<TOptionTime[]>()
    const [dateOptions, setDateOptions] = useState<TOptionDate[]>()
    const [isRule, setIsRule] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [formData, setFormData] = useReducer(
        (state: TFormData, action: Partial<TFormData>) => ({ ...state, ...action }),
        {
            name: user?.name || '',
            phone_number: user?.phone_number || '',
            person_count: 2,
            restaurant:
                locality.restaurants.find(({ id }) => id === bookingModal.restorauntId) || locality.restaurants[0],
            order_time: '',
            order_date: today,
            comment: '',
        },
    )

    const [errors, setErrors] = useReducer((state: TFormDataError | null, action: TFormDataError | null) => {
        if (!action) return null
        return { ...state, ...action }
    }, null)

    // если нет возможности заказа
    const unavailableToday = useMemo(() => daysCount === 0 && (!timeOptions || timeOptions?.length == 0), [timeOptions])

    const restaurantOptions = useMemo(() => {
        const local_options: TOptionTRestaurant[] = []
        locality.restaurants.map((restaurant) => {
            local_options.push({
                value: restaurant,
                label: restaurant.name,
            })
        })
        return local_options
    }, [locality])

    const selectedRestoraunt = useMemo(
        () => restaurantOptions.find(({ value }) => value?.id === formData?.restaurant?.id),
        [restaurantOptions, formData?.restaurant?.id],
    )

    const selectedTime = useMemo(
        () => timeOptions?.find(({ value }) => value === formData?.order_time) || null,
        [timeOptions, formData?.order_time],
    )

    const selectedDate = useMemo(
        () => dateOptions?.find(({ value }) => value === formData?.order_date) || null,
        [dateOptions, formData?.order_date],
    )

    // Список дат бронирования
    useEffect(() => {
        if (!formData.restaurant?.opening_hours) return
        const week = getDayOfWeek(today)
        const { to } = formData.restaurant.opening_hours[week]
        const toHour = Number(to.split(':')[0])
        const todayHour = today.getHours()
        const opt = []

        // Возможность заказов сегодня
        if (todayHour < toHour) {
            const dayText = format(today, 'dd MMMM', {
                locale: ru,
            })
            opt.push({
                label: dayText,
                value: today,
            })
        }

        for (let i = 1; i <= daysCount; i++) {
            const day = addDays(today, i)
            const dayText = format(day, 'dd MMMM', {
                locale: ru,
            })
            opt.push({
                label: dayText,
                value: day,
            })
        }
        setDateOptions(opt)
    }, [formData.restaurant])

    useEffect(() => {
        if (dateOptions?.length) {
            setFormData({ order_date: dateOptions[0].value })
        }
    }, [dateOptions])

    // Список времен бронирования
    useEffect(() => {
        if (!formData.restaurant?.booking_config.is_booking_schedule && !formData.restaurant?.opening_hours) {
            setTimeOptions([])
            setLoading(false)
            return
        }
        const week = getDayOfWeek(formData.order_date)

        if (
            formData.restaurant.booking_config.is_booking_schedule &&
            !formData.restaurant.booking_config.booking_hours[week]
        ) {
            setTimeOptions([])
            setLoading(false)
            return
        }

        setLoading(true)

        const step = 15

        let from = formData.restaurant.opening_hours[week].from
        let to = formData.restaurant.opening_hours[week].to

        if (
            formData.restaurant.booking_config.is_booking_schedule &&
            formData.restaurant.booking_config.booking_hours[week]
        ) {
            from = formData.restaurant.booking_config.booking_hours[week].from
            to = formData.restaurant.booking_config.booking_hours[week].to
        }

        const fromHour = Number(from.split(':')[0])
        const fromMinute = Number(from.split(':')[1])
        const toHour = Number(to.split(':')[0])
        const toMinute = Number(to.split(':')[1])

        const todayHour = today.getHours()
        const todayMinute = today.getMinutes()

        let startHour = fromHour
        let startMinute = fromMinute

        const todayFormat = format(today, 'yyyy-MM-dd')
        const selectedFormat = format(formData.order_date, 'yyyy-MM-dd')
        const isToday = todayFormat === selectedFormat

        if (isToday && todayHour >= fromHour) {
            startHour = todayHour
            startMinute = todayMinute > startMinute ? todayMinute : startMinute
        }
        startMinute = Math.ceil(startMinute / step) * step
        const sh = []

        for (let h = startHour; h <= toHour; h++) {
            const stopMinute = toHour === h ? toMinute : 60
            for (let m = startMinute; m < stopMinute; m += 15) {
                const hour = String(h).padStart(2, '0')
                const minute = String(m).padStart(2, '0')
                sh.push({ value: `${hour}:${minute}`, label: `${hour}:${minute}` })
            }
            startMinute = 0
        }
        setTimeOptions(sh)
        setFormData({ order_time: undefined })
        setLoading(false)
    }, [formData.restaurant, formData.order_date])

    const onChange = (name: string) => (e: ChangeEvent<HTMLInputElement>) => {
        setErrors(null)
        setFormData({ [name]: e.target.value })
    }

    const onSelectChange = (name: string) => (e: any) => {
        setErrors(null)
        setFormData({ [name]: e.value })
    }

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const err = validate(formData)
        setErrors(err)
        const isValid = !Object.keys(err).length
        if (!isValid) return
        try {
            await http.post(ApiEndpoints.ORDER_TABLE, {
                name: formData.name,
                people_count: formData.person_count,
                phone_number: normalizePhone(formData.phone_number),
                comment: formData.comment,
                restaurant_id: formData.restaurant?.id,
                date: format(formData.order_date, 'yyyy-MM-dd'),
                time: formData.order_time,
            })
            addYm('reachGoal', 'reserve')
            onClose()
            successfullReserveModal.open()
        } catch (e: any) {
            console.error(e)
        }
    }

    const onChangeRule = () => {
        setIsRule(!isRule)
    }

    return (
        <>
            <Modal ref={modalRef} className='booking-modal' onClose={onClose} open={open}>
                <Typography className={styles.title}>Забронировать стол</Typography>
                {loading ? (
                    <div className='main-banner__slide loading'>
                        <Loader />
                    </div>
                ) : (
                    //  unavailableToday ? (
                    //     <Typography className={styles.message}>
                    //         К сожалению, на сегодня забронировать столик нет возможности
                    //     </Typography>
                    // ) :
                    <>
                        <Typography className={styles.description}>
                            Хотите насладиться нашими блюдами? <br /> Воспользуйтесь услугой предварительной брони
                            столов в ИТLE
                        </Typography>

                        <form className='booking-modal__fields d-flex flex-wrap' onSubmit={onSubmit}>
                            <div className='booking-modal__field'>
                                <TextInput
                                    placeholder='Ваше имя'
                                    showLabel
                                    value={formData?.name}
                                    error={errors?.name}
                                    onChange={onChange('name')}
                                    fullWidth
                                />
                            </div>
                            <div className='booking-modal__field'>
                                <PhoneInput
                                    label='Телефон'
                                    onChange={onChange('phone_number')}
                                    value={formData?.phone_number}
                                    error={Boolean(errors?.phone_number)}
                                />
                            </div>
                            <div className='booking-modal__field booking-modal__field--select'>
                                <Select
                                    placeholder='Выберите ресторан'
                                    onChange={onSelectChange('restaurant')}
                                    options={restaurantOptions}
                                    value={selectedRestoraunt}
                                    //@ts-ignore
                                    error={Boolean(errors?.restaurant)}
                                />
                            </div>
                            <div className='booking-modal__field'>
                                <TextInput
                                    placeholder='Количество персон'
                                    showLabel
                                    type='number'
                                    value={formData?.person_count}
                                    min='1'
                                    error={errors?.person_count}
                                    onChange={onChange('person_count')}
                                />
                            </div>
                            {unavailableToday || formData?.restaurant?.booking_config.is_booking_disable ? (
                                <Typography className={styles.messageNoBooking}>
                                    К сожалению, на сегодня забронировать столик нет возможности
                                </Typography>
                            ) : (
                                <>
                                    <div className='booking-modal__field booking-modal__field--select'>
                                        <Select
                                            placeholder='Выберите день'
                                            onChange={onSelectChange('order_date')}
                                            options={dateOptions}
                                            value={selectedDate}
                                            //@ts-ignore
                                            error={Boolean(errors?.order_date)}
                                        />
                                    </div>
                                    <div className='booking-modal__field booking-modal__field--select'>
                                        <Select
                                            placeholder='Выберите время'
                                            onChange={onSelectChange('order_time')}
                                            options={timeOptions}
                                            value={selectedTime}
                                            //@ts-ignore
                                            error={Boolean(errors?.order_time)}
                                        />
                                    </div>
                                    <div className='booking-modal__field booking-modal__field--comment'>
                                        <TextAreaInput label='Комментарий' onChange={onChange('comment')} />
                                    </div>

                                    <div className='booking-modal__bottom d-flex items-center'>
                                        <Button disabled={!isRule} className={styles.button}>
                                            Забронировать
                                        </Button>

                                        <Checkbox
                                            label={
                                                <>
                                                    Я соглашаюсь с условиями{' '}
                                                    <Link
                                                        className='booking-modal__bottom-link transition'
                                                        target='_blank'
                                                        href='/legal'
                                                    >
                                                        Пользовательского соглашения
                                                    </Link>
                                                </>
                                            }
                                            checked={isRule}
                                            onChange={onChangeRule}
                                        />
                                    </div>
                                </>
                            )}
                        </form>
                    </>
                )}
            </Modal>
        </>
    )
})

export { BookingModal }
