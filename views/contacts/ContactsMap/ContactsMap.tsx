import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Map, Placemark } from '@pbe/react-yandex-maps'
import type { Map as TMap, Placemark as TPlacemark } from 'yandex-maps'
import { YMaps } from '@pbe/react-yandex-maps'
import { memoize } from 'lodash'

import { Loader } from '~/components'

import { TLocality, TRestaurant } from '~/types/misc'

import { PlacemarkDescription } from './PlacemarkDescription/PlacemarkDescription'
import { PlacemarkDescriptionMobile } from './PlacemarkDescription/PlacemarkDescriptionMobile'

import styles from './ContactsMap.module.scss'

type TLocationRef = {
    instance: TPlacemark
    removeEventHandlers: () => void
}

interface Props {
    selectedRestaurant: TRestaurant | null
    locality: TLocality
    setSelectedRestaurant: (restaurant: TRestaurant | null) => void
}

export const ContactsMap: FC<Props> = ({ selectedRestaurant, locality, setSelectedRestaurant }) => {
    const mapRef = useRef<TMap | null>(null)
    const { current: placemarkRefs } = useRef<Record<string, TLocationRef>>({})

    let windowWidth = 1400
    if (typeof window !== 'undefined') {
        windowWidth = window.innerWidth
    }

    const [loading, setLoading] = useState(true)
    const [showModal, doShowModal] = useState(false)

    // change the map center when a locality is changed
    useEffect(() => {
        if (mapRef.current !== null) {
            mapRef.current?.setCenter([locality.latitude, locality.longitude])
        }
    }, [locality])

    const handlePlacemarkRef = useCallback(
        memoize((restaurantId: number) => (placemark: TMap | null) => {
            const handler = () => {
                doShowModal(true)
                setSelectedRestaurant(
                    locality.restaurants.find((restaurant) => {
                        return restaurant.id === restaurantId
                    }) ?? null,
                )
            }

            if (placemark === null) {
                if (placemarkRefs[restaurantId] !== undefined) {
                    placemarkRefs[restaurantId].removeEventHandlers()

                    delete placemarkRefs[restaurantId]
                }

                return
            }

            placemark.events.add('click', handler)

            placemarkRefs[restaurantId] = {
                //@ts-ignore
                instance: placemark,
                removeEventHandlers: () => {
                    placemark.events.remove('click', handler)
                },
            }
        }),
        [locality, placemarkRefs],
    )

    const handleMapRef = (map: TMap | null) => {
        mapRef.current = map
    }

    const getApiKey = () => {
        const apiKeysString = process.env.NEXT_PUBLIC_YANDEX_GEOCODER_KEY
        const apiKeysArray = apiKeysString?.split('|')

        return apiKeysArray === undefined ? '' : apiKeysArray[Math.floor(Math.random() * apiKeysArray.length)]
    }

    return (
        <YMaps
            preload
            query={{
                apikey: getApiKey(),
            }}
        >
            <div className={styles.map}>
                {loading && (
                    <div className={styles.loader}>
                        <Loader />
                    </div>
                )}
                <Map
                    defaultState={{
                        center: [locality.latitude, locality.longitude],
                        zoom: windowWidth < 1200 ? 10 : 12,
                    }}
                    height='100%'
                    instanceRef={handleMapRef as any}
                    onLoad={() => setLoading(false)}
                    width='100%'
                >
                    {locality.restaurants.map((restaurant) => {
                        return (
                            <Placemark
                                key={restaurant.id}
                                geometry={[restaurant.latitude, restaurant.longitude]}
                                instanceRef={handlePlacemarkRef(restaurant.id)}
                                options={{
                                    iconColor: selectedRestaurant?.id === restaurant.id ? '#6a893e' : '#9b3d30',
                                }}
                            />
                        )
                    })}
                </Map>
                {selectedRestaurant !== null && <PlacemarkDescription selectedRestaurant={selectedRestaurant} />}
                {selectedRestaurant !== null && (
                    <PlacemarkDescriptionMobile
                        doShowModal={doShowModal}
                        selectedRestaurant={selectedRestaurant}
                        showModal={showModal}
                    />
                )}
            </div>
        </YMaps>
    )
}
