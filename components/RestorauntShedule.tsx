import { FC, memo, useState, useMemo, useEffect } from 'react'
import cn from 'classnames'
import { normalizePhone } from '~/helpers'
import { useStore } from '~/hooks'
import { daysOfWeekShortLabels } from '~/constants/daysOfWeek'
import { TDayOfWeek } from '~/types/misc'
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps'

type TWeek = Record<'weekDay' | 'from' | 'to', string>

interface IShedule {
    restaurantId: number
    withBooking?: boolean
    latitudePlus?: number
    longitudePlus?: number
}
const Shedule: FC<IShedule> = ({ restaurantId, withBooking, latitudePlus = 0, longitudePlus = -0.07 }: IShedule) => {
    const [currentLocation, setCurrentLocation] = useState<number[]>()
    const day = new Date().getDay()
    const { localities, bookingModal } = useStore()

    const restaurant = useMemo(() => {
        const currentLocality = localities.find((item) => item.is_default)
        return currentLocality?.restaurants.find(({ id }) => restaurantId === id)
    }, [])

    useEffect(() => {
        if (!restaurant || !currentLocation) return
        const from = `${currentLocation[0]}%2C${currentLocation[1]}`
        const to = `${restaurant.latitude}%2C${restaurant.longitude}`
        const routeMap = `https://yandex.ru/maps/43/kazan/?ll=49.118278%2C55.800083&mode=routes&rtext=${from}~${to}&rtt=auto&ruri=~&z=12`
        if (!window.open(routeMap, '_blank')) {
            location.href = routeMap
        }
    }, [currentLocation])

    if (!restaurant) return null

    const weekShedule: TWeek[] = useMemo(() => {
        const days = Object.keys(daysOfWeekShortLabels) as TDayOfWeek[]
        return days.map((item) => {
            return {
                weekDay: daysOfWeekShortLabels[item],
                ...restaurant.opening_hours[item],
            }
        })
    }, [])

    const onMapRoute = () => {
        navigator.geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude } }) => {
                setCurrentLocation([latitude, longitude])
            },
            (error) => {
                console.error('Error getting user location:', error)
            },
        )
    }
    const doBooking = (restaurantId: number) => () => {
        bookingModal.open(restaurantId)
    }
    return (
        <section className='section-page institution-info'>
            <div className='container'>
                <div className='institution-info__inner d-flex flex-wrap'>
                    <div className='institution-info__block'>
                        <div className='details d-flex flex-wrap items-center'>
                            <div className='details__top d-flex justify-between'>
                                <a
                                    aria-label='ИТЛЕ телефон'
                                    href={`tel:${normalizePhone(restaurant?.phone_number || '')}`}
                                    className='details__top-phone d-flex items-center'
                                >
                                    <span className='icon-phone-map'></span>
                                    {restaurant?.phone_number}
                                </a>
                                {/* <a href='' className='details__top-btn d-flex items-center transition'>
                                    Смотреть локацию
                                </a> */}
                            </div>
                            <h2 className='details__address'>{restaurant.address}</h2>
                            <div className='schedule d-flex'>
                                {weekShedule.map(({ weekDay, from, to }: TWeek, index) => (
                                    <div key={weekDay} className='schedule__day d-flex'>
                                        <div
                                            className={cn('schedule__day-inner d-flex flex-column items-center', {
                                                'is-today': day === index + 1,
                                            })}
                                        >
                                            <span className='schedule__day-title'>{weekDay}</span>
                                            <span className='schedule__day-time'>{from}</span>
                                            <span className='schedule__day-line'></span>
                                            <span className='schedule__day-time'>{to}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* <a href='' className='institution-info__block-link block-center transition'>
                            Открыть на карте
                        </a> */}
                        <div className='institution-info__block-buttons d-flex flex-column justify-end'>
                            <button
                                onClick={onMapRoute}
                                className='institution-info__block-btn institution-info__block-btn--bordered d-flex items-center transition'
                            >
                                Проложить маршрут на карте
                            </button>
                            {withBooking ? (
                                <button
                                    onClick={doBooking(restaurantId)}
                                    className='institution-info__block-btn address-page__item-btn--primary d-flex items-center transition'
                                >
                                    Забронировать стол
                                </button>
                            ) : null}
                        </div>

                        <div className='institution-info__map'>
                            <YMaps>
                                <Map
                                    width='100%'
                                    height='100%'
                                    defaultState={{
                                        center: [
                                            restaurant.latitude + latitudePlus,
                                            restaurant.longitude + longitudePlus,
                                        ],
                                        zoom: 12,
                                    }}
                                >
                                    <Placemark
                                        options={{
                                            iconImageHref: '/images/fire_icon.png',
                                            iconLayout: 'default#image',
                                            iconImageSize: [40, 40],
                                        }}
                                        geometry={[restaurant.latitude, restaurant.longitude]}
                                    />
                                </Map>
                            </YMaps>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default memo(Shedule)
