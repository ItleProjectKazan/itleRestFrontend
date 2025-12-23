import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Map, Placemark, YMaps, ZoomControl, GeolocationControl } from '@pbe/react-yandex-maps'
import type { Map as TMap /*, Placemark as TPlacemark*/ } from 'yandex-maps'
// import { memoize } from 'lodash'
import { usePrevious, useStore } from '~/hooks'
import { Button, Loader, Typography } from '~/components'
import { TDayOfWeek, TLocality, TRestaurant, TSelectedRestaurantInfo } from '~/types/misc'
import { daysOfWeekShortLabels } from '~/constants/daysOfWeek'
import styles from './RestaurantSelectModal.module.scss'
import { TOrderType } from '~/types/order'

type TDaySchedule = {
    startDay: TDayOfWeek
    endDay: TDayOfWeek
    startTime: string
    endTime: string
}

interface Props {
    // currentRestaurantId: number | null
    locality: TLocality
    handlePlacemarkRef: any
    selectRestaurant: (restaurant: TSelectedRestaurantInfo) => void
    selectedRestaurant: TRestaurant | null
    setSelectedRestaurant: (r: TRestaurant | null) => void
}

export const PickupContent: FC<Props> = ({
    handlePlacemarkRef /*, currentRestaurantId*/,
    locality,
    selectRestaurant,
    selectedRestaurant,
    setSelectedRestaurant,
}) => {
    const mapRef = useRef<TMap | null>(null)

    const { orderParams } = useStore()

    const [loading, setLoading] = useState(true)

    // change the map center when a locality is changed
    useEffect(() => {
        if (mapRef.current !== null) {
            mapRef.current?.setCenter([locality.latitude, locality.longitude])
        }
    }, [locality])

    const prevLocalityId = usePrevious(locality.id)

    // reset location when locality is changed
    useEffect(() => {
        if (prevLocalityId !== null && prevLocalityId !== locality.id) {
            setSelectedRestaurant(null)
        }
    }, [locality.id, prevLocalityId])

    // set init location if nothing was previously selected
    useEffect(() => {
        if (selectedRestaurant == null) {
            if (locality.restaurants.length && typeof locality.restaurants[0] !== 'undefined') {
                setSelectedRestaurant(locality.restaurants[0])
            }
        }
    }, [locality, selectedRestaurant, setSelectedRestaurant])

    const handleButtonClick = useCallback(() => {
        if (selectedRestaurant === null) {
            return
        }

        const pickupDeliveryZone = selectedRestaurant.delivery_zones.find((zone: any) => {
            return zone.type === TOrderType.PICKUP
        })

        if (pickupDeliveryZone === undefined) {
            throw new Error(`Pickup delivery zone doesnt't exist in restaurant #${selectedRestaurant.id}`)
        }

        selectRestaurant({
            id: selectedRestaurant.id,
            delivery_zone_id: pickupDeliveryZone.id,
            delivery_details: null,
        })
        orderParams.setDeliveryZoneId(pickupDeliveryZone.id)
    }, [selectedRestaurant, selectRestaurant])

    const handleMapRef = (map: TMap | null) => {
        mapRef.current = map
    }

    const schedule = useMemo(() => {
        if (selectedRestaurant === null) {
            return null
        }

        const openingHours = selectedRestaurant.opening_hours
        const daysOfWeek = Object.keys(openingHours) as TDayOfWeek[]
        const firstDay = daysOfWeek.shift() as TDayOfWeek
        const result: TDaySchedule[] = []

        const addDay = (day: TDayOfWeek) => {
            result.push({
                startDay: day,
                endDay: day,
                startTime: openingHours[day].from,
                endTime: openingHours[day].to,
            })
        }

        addDay(firstDay)

        daysOfWeek.forEach((dayOfWeek) => {
            const lastIndex = result.length - 1

            if (
                openingHours[dayOfWeek].from === result[lastIndex].startTime &&
                openingHours[dayOfWeek].to === result[lastIndex].endTime
            ) {
                result[lastIndex].endDay = dayOfWeek
                return
            }

            addDay(dayOfWeek)
        })

        return result
    }, [selectedRestaurant])

    const getDayLabel = (daySchedule: TDaySchedule) => {
        if (daySchedule.startDay === daySchedule.endDay) {
            return daysOfWeekShortLabels[daySchedule.startDay]
        }

        return `${daysOfWeekShortLabels[daySchedule.startDay]}-${daysOfWeekShortLabels[daySchedule.endDay]}`
    }
    return (
        <>
            <div className={styles.map}>
                {loading && (
                    <div className={styles.loader}>
                        <Loader />
                    </div>
                )}
                <YMaps>
                    <Map
                        defaultState={{
                            center: [
                                selectedRestaurant !== null ? selectedRestaurant.latitude : locality.latitude,
                                selectedRestaurant !== null ? selectedRestaurant.longitude : locality.longitude,
                            ],
                            zoom: 10,
                            controls: [],
                        }}
                        height='400px'
                        instanceRef={handleMapRef as any}
                        onLoad={() => setLoading(false)}
                        width='100%'
                    >
                        {locality.restaurants.map((restaurant: TRestaurant) => {
                            return (
                                <Placemark
                                    key={restaurant.id}
                                    geometry={[restaurant.latitude, restaurant.longitude]}
                                    instanceRef={handlePlacemarkRef(restaurant.id)}
                                    options={{
                                        // iconColor: selectedRestaurant?.id === restaurant.id ? '#6a893e' : '#9b3d30',
                                        iconImageHref:
                                            selectedRestaurant?.id === restaurant.id
                                                ? '/images/map/icon1.svg'
                                                : '/images/map/icon2.svg',
                                        iconLayout: 'default#image',
                                        iconImageSize: selectedRestaurant?.id === restaurant.id ? [50, 50] : [40, 40],
                                    }}
                                />
                            )
                        })}
                        <ZoomControl options={{ size: 'small', position: { right: '10px', bottom: '70px' } }} />
                        <GeolocationControl options={{ position: { right: '10px', bottom: '30px' } }} />
                    </Map>
                </YMaps>
            </div>
            {selectedRestaurant !== null && schedule !== null && (
                <div className={styles.pickup_location_selected_holder}>
                    <div className={styles.selectedLocation}>
                        <div>
                            <Typography className={styles.pickUpAdressHeader} lineHeight={34} size={24}>
                                Адрес:
                            </Typography>
                            <Typography lineHeight={34} size={20}>
                                {selectedRestaurant.address}
                            </Typography>
                            <Typography lineHeight={26} size={16} weight='normal'>
                                {schedule.map((daySchedule) => (
                                    <React.Fragment key={daySchedule.startDay}>
                                        <b>{getDayLabel(daySchedule)}</b>
                                        &nbsp;
                                        {daySchedule.startTime} - {daySchedule.endTime}
                                        &nbsp;
                                    </React.Fragment>
                                ))}
                            </Typography>
                        </div>
                        <Button className={styles.selectButton} onClick={handleButtonClick} size='medium'>
                            Подтвердить
                        </Button>
                    </div>
                </div>
            )}
        </>
    )
}

export default PickupContent
