import React, { FC, useCallback, useEffect, useState } from 'react'
import {
    Map,
    YMaps,
    Placemark,
    Polygon,
    withYMaps,
    GeolocationControl,
    ZoomControl /*, WithYMapsProps*/,
} from '@pbe/react-yandex-maps'
import type { IEvent, Map as TMap, Placemark as TPlacemark /*, Polygon as TPolygon*/ } from 'yandex-maps'
import { usePrevious, useStore } from '~/hooks'
import { Loader } from '~/components'
import { DeliveryNotPossible } from './DeliveryNotPossible'
import { TAddressComponents, TCoords, TDeliveryZone, TLocality } from '~/types/misc'
import styles from './RestaurantSelectModal.module.scss'

const yandexMapsModules = ['coordSystem.geo', 'geocode', 'geoQuery']

const MAP_DEFAULT_ZOOM = 12
const MAP_CLICK_ZOOM = 16
const DELIVERY_ZONE_COLORS = ['#ed4543', '#b51eff', '#56db40', '#ffd21e']

interface Props {
    locality: TLocality
    inputValue: string
    deliveryLocationCoords: string
    deliveryPossible: boolean
    deliveryZonesRef: any
    mapRef: any
    setDeliveryPossible: (value: boolean) => void
    setInputValue: (value: string) => void
    onSwitchToPickup: () => void
    scrollBottom: () => void
    // selectRestaurant: (restaurant: TSelectedRestaurantInfo) => void
    setDeliveryLocationCoords: (value: string) => void
}

const DeliveryContent = withYMaps<Props & any /*& WithYMapsProps*/>(
    ({
        locality,
        onSwitchToPickup,
        scrollBottom,
        deliveryPossible,
        setDeliveryPossible,
        deliveryLocationCoords,
        setDeliveryLocationCoords,
        /*selectRestaurant,*/ inputValue,
        setInputValue,
        ymaps,
        deliveryZonesRef,
        mapRef,
    }) => {
        const { orderParams } = useStore()

        const [loading, setLoading] = useState(true)
        const [deliveryTabViewed, setDeliveryTabViewed] = useState(false)
        const [displayRestaurants, setDisplayRestaurants] = useState(false)

        const prevLocalityId = usePrevious(locality.id)

        useEffect(() => {
            if (prevLocalityId === null || locality.id === prevLocalityId) {
                return
            }

            // change the map center when a locality is changed
            if (mapRef.current !== null) {
                mapRef.current.setCenter([locality.latitude, locality.longitude])
                mapRef.current.setZoom(MAP_DEFAULT_ZOOM)
            }

            // clear input when locality is changed
            setDeliveryLocationCoords(null)
            setInputValue('')
            setDeliveryTabViewed(true)
        }, [locality, prevLocalityId])

        useEffect(() => {
            // change the map center when a placemark coords are changed
            if (mapRef.current !== null && deliveryLocationCoords !== null) {
                mapRef.current.setCenter([deliveryLocationCoords.latitude, deliveryLocationCoords.longitude])
                mapRef.current.setZoom(MAP_CLICK_ZOOM)
            }
        }, [deliveryLocationCoords])

        // set address to input on click to map
        useEffect(() => {
            if (
                deliveryLocationCoords === null ||
                inputValue !== '' ||
                deliveryLocationCoords.type !== 'map-click' ||
                !ymaps ||
                !ymaps?.geocode
            ) {
                return
            }

            if (orderParams.localityId !== locality.id && !deliveryTabViewed) {
                setDeliveryTabViewed(true)

                return
            }

            const { latitude, longitude } = deliveryLocationCoords

            ymaps
                .geocode([latitude, longitude], {
                    kind: 'house',
                })
                .then((response: any) => {
                    const objects = response.geoObjects.toArray()

                    if (objects.length === 0) {
                        return
                    }

                    const componentsArr = objects[0].properties.get(
                        'metaDataProperty.GeocoderMetaData.Address.Components',
                    )
                    const components = componentsArr.reduce(
                        (
                            result: any,
                            component: {
                                kind: keyof TAddressComponents
                                name: string
                            },
                        ) => {
                            result[component.kind] = component.name

                            return result
                        },
                        {},
                    )
                    const address = [
                        components.street,
                        components.house,
                        components.locality,
                        components.province,
                    ].join(', ')

                    setInputValue(address)
                    setDeliveryLocationCoords((value: any) => {
                        if (value === null) {
                            return null
                        }

                        return {
                            ...value,
                            address: {
                                locality: components.locality,
                                province: components.province,
                                street: components.street,
                                house: components.house,
                            },
                        }
                    })
                })
                .catch(console.error)
        }, [deliveryLocationCoords, inputValue, ymaps, orderParams.localityId, locality.id])

        // scroll bottom when delivery is not possible to make it fully visible
        useEffect(() => {
            if (!deliveryPossible) {
                scrollBottom()
            }
        }, [deliveryPossible, scrollBottom])

        useEffect(() => {
            const handler = (event: KeyboardEvent) => {
                if (event.altKey && event.key === 'r') {
                    event.preventDefault()

                    setDisplayRestaurants((value) => !value)
                }
            }

            document.addEventListener('keydown', handler)

            return () => document.removeEventListener('keydown', handler)
        }, [])

        const handlePickupAnswer = useCallback(
            (usePickup: boolean) => {
                if (usePickup) {
                    onSwitchToPickup()
                } else {
                    setDeliveryPossible(true)
                }
            },
            [onSwitchToPickup],
        )

        const getDeliveryZone = useCallback(
            (coords: TCoords) => {
                if (ymaps === undefined) {
                    return null
                }

                const deliveryZonesQuery = ymaps
                    .geoQuery(Object.values(deliveryZonesRef.current))
                    .addToMap(mapRef.current)
                const selectedPointCoords = [coords.latitude, coords.longitude]

                const deliveryZoneIds: number[] = []

                deliveryZonesQuery.searchContaining(selectedPointCoords).each((obj: any) => {
                    deliveryZoneIds.push(obj.properties.get('id'))
                })

                if (deliveryZoneIds.length === 0) {
                    return null
                }

                const deliveryZoneRestaurantIdMap: Record<number, number> = {}
                const deliveryZones: TDeliveryZone[] = []

                locality.restaurants.forEach((restaurant: any) => {
                    restaurant.delivery_zones.forEach((zone: any) => {
                        if (!deliveryZoneIds.includes(zone.id)) {
                            return
                        }

                        deliveryZoneRestaurantIdMap[zone.id] = restaurant.id

                        deliveryZones.push(zone)
                    })
                })

                // TODO: find most suitable delivery zone by delivery price, price and so on
                const deliveryZone = deliveryZones[0]

                return {
                    restaurantId: deliveryZoneRestaurantIdMap[deliveryZone.id],
                    zoneId: deliveryZone.id,
                }
            },
            [locality, ymaps],
        )

        const handleMapClick = useCallback(
            (event: IEvent<MouseEvent, ''>) => {
                const [latitude, longitude] = event.get('coords')

                const coords = {
                    latitude: parseFloat(latitude.toFixed(6)),
                    longitude: parseFloat(longitude.toFixed(6)),
                }

                const deliveryZone = getDeliveryZone(coords)

                if (deliveryZone === null) {
                    setDeliveryPossible(false)

                    return
                }

                ymaps
                    .geocode([latitude, longitude], {
                        kind: 'house',
                    })
                    .then((response: any) => {
                        const objects = response.geoObjects.toArray()

                        if (objects.length === 0) {
                            return
                        }

                        const componentsArr = objects[0].properties.get(
                            'metaDataProperty.GeocoderMetaData.Address.Components',
                        )
                        const components = componentsArr.reduce(
                            (
                                result: any,
                                component: {
                                    kind: keyof TAddressComponents
                                    name: string
                                },
                            ) => {
                                result[component.kind] = component.name

                                return result
                            },
                            {},
                        )
                        const address = [
                            components.street,
                            components.house,
                            components.locality,
                            components.province,
                        ].join(', ')

                        setInputValue(address)
                        setDeliveryLocationCoords({
                            type: 'map-click',
                            address: {
                                locality: components.locality,
                                province: components.province,
                                street: components.street,
                                house: components.house,
                            },
                            latitude: parseFloat(latitude.toFixed(6)),
                            longitude: parseFloat(longitude.toFixed(6)),
                        })
                    })
                    .catch(console.error)

                setDeliveryLocationCoords({
                    type: 'map-click',
                    address: null,
                    latitude: parseFloat(latitude.toFixed(6)),
                    longitude: parseFloat(longitude.toFixed(6)),
                })
                setInputValue('')
            },
            [getDeliveryZone],
        )

        const handleMapRef = (map: TMap | null) => {
            if (map === null) {
                return
            }
            // @ts-ignore
            map.events.add('click', handleMapClick)

            mapRef.current = map
        }

        const handleCustomLocationPlacemarkRef = useCallback((placemark: TPlacemark) => {
            if (placemark === null) {
                // setDeliveryLocationCoords(null)
                return
            }

            placemark.events.add('dragend', () => {
                const coords = placemark.geometry?.getCoordinates() ?? null

                if (coords === null) {
                    return
                }

                const [latitude, longitude] = coords

                setDeliveryLocationCoords({
                    type: 'map-click',
                    address: null,
                    latitude,
                    longitude,
                })
                setInputValue('')
            })
        }, [])

        const handleDeliveryZonePolygonRef = (zoneId: number) => (polygon: TMap /*TPolygon*/) => {
            if (polygon === null) {
                delete deliveryZonesRef.current[zoneId]

                return
            }
            deliveryZonesRef.current[zoneId] = polygon
            // @ts-ignore
            polygon.events.add('click', handleMapClick)
        }

        // use a separate effect to add event listener to update it if the handler has been updated
        useEffect(() => {
            const polygons = deliveryZonesRef.current

            const map = (callback: (polygon: TMap) => void) => {
                Object.keys(polygons).map((zoneId) => {
                    const deliveryZonePolygon = polygons[parseInt(zoneId, 10)]

                    callback(deliveryZonePolygon)
                })
            }

            // @ts-ignore
            map((polygon) => polygon.events.remove('click', handleMapClick))
            // @ts-ignore
            map((polygon) => polygon.events.add('click', handleMapClick))

            return () => {
                // @ts-ignore
                map((polygon) => polygon.events.remove('click', handleMapClick))
            }
        }, [handleMapClick])

        return (
            <>
                {deliveryPossible && (
                    <div className={styles.map}>
                        {loading && (
                            <div className={styles.loader}>
                                <Loader />
                            </div>
                        )}
                        <YMaps>
                            <Map
                                defaultState={{
                                    center: [locality.latitude, locality.longitude],
                                    zoom: MAP_DEFAULT_ZOOM,
                                }}
                                height='400px'
                                instanceRef={handleMapRef as any}
                                onLoad={() => setLoading(false)}
                                width='100%'
                            >
                                {deliveryLocationCoords !== null && (
                                    <Placemark
                                        geometry={[deliveryLocationCoords.latitude, deliveryLocationCoords.longitude]}
                                        //@ts-ignore
                                        instanceRef={handleCustomLocationPlacemarkRef}
                                        options={{
                                            draggable: true,
                                            iconColor: '#6a893e',
                                        }}
                                    />
                                )}
                                {locality.restaurants.map((restaurant: any) => (
                                    <React.Fragment key={restaurant.id}>
                                        {displayRestaurants && (
                                            <Placemark
                                                key={restaurant.id}
                                                geometry={[restaurant.latitude, restaurant.longitude]}
                                                //@ts-ignore
                                                instanceRef={handleCustomLocationPlacemarkRef}
                                                options={{
                                                    draggable: true,
                                                    iconColor: '#0271d5',
                                                }}
                                            />
                                        )}
                                        {restaurant.delivery_zones.map((zone: any, index: any) => {
                                            if (zone.area === null || !zone.area.length) {
                                                return null
                                            }

                                            const area = zone.area.map((coords: any) => [...coords].reverse())

                                            return (
                                                <Polygon
                                                    key={zone.id}
                                                    geometry={[area]}
                                                    instanceRef={handleDeliveryZonePolygonRef(zone.id)}
                                                    options={{
                                                        fillColor:
                                                            DELIVERY_ZONE_COLORS[index] ?? DELIVERY_ZONE_COLORS[0],
                                                        fillOpacity: displayRestaurants ? 0.5 : 0,
                                                        strokeWidth: 0,
                                                    }}
                                                    properties={{
                                                        id: zone.id,
                                                    }}
                                                />
                                            )
                                        })}
                                    </React.Fragment>
                                ))}
                                <ZoomControl options={{ size: 'small', position: { right: '10px', bottom: '70px' } }} />
                                <GeolocationControl options={{ position: { right: '10px', bottom: '30px' } }} />
                            </Map>
                        </YMaps>
                    </div>
                )}
                {!deliveryPossible && <DeliveryNotPossible onPickupAnswer={handlePickupAnswer} />}
            </>
        )
    },
    false,
    yandexMapsModules,
) as FC<Props>

export { DeliveryContent }
