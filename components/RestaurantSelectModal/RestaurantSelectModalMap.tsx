import React, { FC, useCallback, useRef, useState, useEffect, ChangeEvent } from 'react'
import { IMSTArray, ISimpleType } from 'mobx-state-tree'
import { withYMaps } from '@pbe/react-yandex-maps'
import type { Map as TMap } from 'yandex-maps'
import { Button } from '~/components'
import { Typography } from '~/components'
import { DeliveryContent } from './DeliveryContent'
// import { LocalitySelect } from './LocalitySelect'
import { LocationInput } from './LocationInput'
import PickupContent from './PickupContent'
import { OrderTypeSelect } from '~/components/Inputs/OrderTypeSelect'
import { TCoords, TDeliveryZone, TSelectedRestaurantInfo, TRestaurant, TLocality } from '~/types/misc'
import { TOrderType } from '~/types/order'
import styles from './RestaurantSelectModal.module.scss'
import { TOrderParams } from '~/store/models/OrderParams'
import { memoize } from 'lodash'
// import { PageLinks } from '~/constants/pageLinks'
import { useRouter } from 'next/router'
import { PageLinks } from '~/constants/pageLinks'
import { postFrontendLog } from '~/services/queries'
import { useCart, useStore } from '~/hooks'

const yandexMapsModules = ['coordSystem.geo', 'geocode', 'geoQuery']

type TLocationRef = {
    instance: any
    removeEventHandlers: () => void
}
interface Props {
    localityBorderBox: {
        lowerCorner: IMSTArray<ISimpleType<number>>
        upperCorner: IMSTArray<ISimpleType<number>>
    }
    localities: TLocality[]
    orderParams: TOrderParams
    locality: TLocality
    type: TOrderType
    restaurantClosed: boolean
    selectRestaurant: (d: TSelectedRestaurantInfo | null) => void
    handleTypeChange: (type: TOrderType) => void
    handleSwitchToPickup: () => void
    scrollBottom: () => void
    setRestaurantInfo: (d: TSelectedRestaurantInfo) => void
    handleLocalityChange: (localityId: number) => void
}

const RestaurantSelectModalMap: FC<Props> = withYMaps<Props & any /*WithYMapsProps*/>(
    ({
        ymaps,
        type,
        // localities,
        localityBorderBox,
        orderParams,
        locality,
        // restaurantClosed,
        selectRestaurant,
        handleTypeChange,
        handleSwitchToPickup,
        scrollBottom,
        setRestaurantInfo,
        // handleLocalityChange,
    }) => {
        const currentRestaurantId = orderParams.restaurantId
        const router = useRouter()

        const { user } = useStore()

        const mapRef = useRef<TMap | null>(null)
        const deliveryZonesRef = useRef<Record<number, TMap /*TPolygon*/>>({})
        const cart = useCart()
        const [apartment, setApartment] = useState('')
        const [doorCode, setDoorCode] = useState('')
        const [porch, setPorch] = useState('')
        const [floor, setFloor] = useState('')

        const { current: placemarkRefs } = useRef<Record<string, TLocationRef>>({})
        const [inputValue, setInputValue] = useState('')
        const [selectedRestaurant, setSelectedRestaurant] = useState<TRestaurant | null>(
            () => locality.restaurants.find((restaurant: any) => restaurant.id === currentRestaurantId) ?? null,
        )
        const [deliveryPossible, setDeliveryPossible] = useState(true)

        useEffect(() => {
            setApartment(orderParams?.deliveryDetails?.apartment || '')
            setDoorCode(orderParams?.deliveryDetails?.door_code || '')
            setPorch(orderParams?.deliveryDetails?.porch || '')
            setFloor(orderParams?.deliveryDetails?.floor || '')
        }, [orderParams?.deliveryDetails])

        const [deliveryLocationCoords, setDeliveryLocationCoords] = useState<any>(
            orderParams.deliveryDetails !== null
                ? {
                      type: 'map-click',
                      address: null,
                      latitude: orderParams.deliveryDetails.coords.latitude,
                      longitude: orderParams.deliveryDetails.coords.longitude,
                  }
                : null,
        )

        const handleInputChange = useCallback(() => {
            setDeliveryLocationCoords(null)
            postFrontendLog({
                site: 'rest',
                type: 'delivery',
                class: 'RestaurantSelectModalMap',
                method: 'handleInputChange',
                description: 'setDeliveryLocationCoords(null)',
                user,
                orderParams,
                cart,
            })
        }, [])

        const getDeliveryZone = useCallback(
            (coords: TCoords) => {
                try {
                    if (ymaps === undefined) {
                        return null
                    }
                    const deliveryZonesQuery = ymaps
                        .geoQuery(Object.values(deliveryZonesRef.current))
                        .addToMap(mapRef.current)

                    postFrontendLog({
                        site: 'rest',
                        type: 'delivery',
                        class: 'RestaurantSelectModalMap',
                        method: 'getDeliveryZone 1',
                        user,
                        deliveryZonesQuery,
                        cart,
                        deliveryZonesRef: deliveryZonesRef.current,
                        mapRef: mapRef.current,
                    })
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
                    postFrontendLog({
                        site: 'rest',
                        type: 'delivery',
                        class: 'RestaurantSelectModalMap',
                        method: 'getDeliveryZone 2',
                        user,
                        deliveryZones,
                        cart,
                    })
                    return {
                        restaurantId: deliveryZoneRestaurantIdMap[deliveryZone.id],
                        zoneId: deliveryZone.id,
                    }
                } catch (e: any) {
                    console.error(e)
                    postFrontendLog({
                        site: 'rest',
                        type: 'delivery',
                        class: 'RestaurantSelectModalMap',
                        method: 'getDeliveryZone catch',
                        user,
                        error: e,
                        orderParams,
                        cart,
                    })
                }
            },
            [locality, ymaps],
        )
        const handleButtonClick = //useCallback(
            () => {
                postFrontendLog({
                    site: 'rest',
                    type: 'pickup',
                    class: 'RestaurantSelectModalMap',
                    method: 'handleButtonClick start',
                    user,
                    deliveryLocationCoords,
                    orderParams,
                    cart,
                })
                if (deliveryLocationCoords === null || deliveryLocationCoords.address === null) {
                    return
                }
                const deliveryZone = getDeliveryZone({
                    latitude: deliveryLocationCoords.latitude,
                    longitude: deliveryLocationCoords.longitude,
                })

                if (!deliveryZone) {
                    setDeliveryPossible(false)
                    return
                }

                selectRestaurant({
                    id: deliveryZone.restaurantId,
                    delivery_zone_id: deliveryZone.zoneId,
                    delivery_details: {
                        address: inputValue,
                        street: deliveryLocationCoords.address.street,
                        house: deliveryLocationCoords.address.house,
                        locality: deliveryLocationCoords.address.locality,
                        province: deliveryLocationCoords.address.province,
                        coords: {
                            latitude: deliveryLocationCoords.latitude,
                            longitude: deliveryLocationCoords.longitude,
                        },
                        apartment: apartment,
                        door_code: doorCode,
                        porch: porch,
                        floor: floor,
                    },
                })

                orderParams.setDeliveryZoneId(deliveryZone.zoneId)

                if (router.asPath.startsWith(PageLinks.MENU)) {
                    router.push(PageLinks.MENU + '/' + deliveryZone.restaurantId)
                }
            }
        // , [deliveryLocationCoords, getDeliveryZone, inputValue, selectRestaurant, apartment, doorCode, porch, floor])

        const handleButtonRestaurantClick = useCallback(() => {
            postFrontendLog({
                site: 'rest',
                class: 'RestaurantSelectModalMap',
                method: 'handleButtonRestaurantClick start',
                user,
                deliveryLocationCoords,
                orderParams,
                cart,
            })
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
            if (router.asPath.startsWith(PageLinks.MENU)) {
                router.push(PageLinks.MENU + '/' + selectedRestaurant.id)
            }
        }, [selectedRestaurant, selectRestaurant])

        const handleInputSuggestionClick = (parameters: {
            address: string
            province: string
            locality: string
            street: string
            house: string
            coords: TCoords
        }) => {
            postFrontendLog({
                site: 'rest',
                class: 'RestaurantSelectModalMap',
                method: 'handleInputSuggestionClick start',
                user,
                parameters,
                orderParams,
            })
            const deliveryZone = getDeliveryZone(parameters.coords)
            postFrontendLog({
                site: 'rest',
                class: 'RestaurantSelectModalMap',
                method: 'handleInputSuggestionClick middle_1',
                user,
                deliveryZone,
            })
            if (deliveryZone === null) {
                postFrontendLog({
                    site: 'rest',
                    class: 'RestaurantSelectModalMap',
                    method: 'handleInputSuggestionClick middle_2',
                    description: 'deliveryZone === null',
                    user,
                })
                setDeliveryPossible(false)
            }
            setInputValue(parameters.address)
            setDeliveryLocationCoords({
                type: 'search',
                address: {
                    province: parameters.province,
                    locality: parameters.locality,
                    street: parameters.street,
                    house: parameters.house,
                },
                ...parameters.coords,
            })

            postFrontendLog({
                site: 'rest',
                class: 'RestaurantSelectModalMap',
                method: 'handleInputSuggestionClick end',
                user,
            })
        }

        const handlePlacemarkRef = useCallback(
            memoize((restaurantId: number) => (placemark: any) => {
                const handler = () => {
                    setSelectedRestaurant(
                        locality.restaurants.find((restaurant: any) => {
                            return restaurant.id === restaurantId
                        }) ?? null,
                    )

                    // scroll bottom on click to a placemark
                    scrollBottom()
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
                    instance: placemark,
                    removeEventHandlers: () => {
                        placemark.events.remove('click', handler)
                    },
                }
            }),
            [locality, placemarkRefs, scrollBottom],
        )
        const onRestaurantClick = (restaurantId: number) => () => {
            setSelectedRestaurant(
                locality.restaurants.find((restaurant: any) => {
                    return restaurant.id === restaurantId
                }) ?? null,
            )
        }

        const onChangeApartment = (e: ChangeEvent<HTMLInputElement>) => {
            setApartment(e.target.value)
        }
        const onChangeDoorCode = (e: ChangeEvent<HTMLInputElement>) => {
            setDoorCode(e.target.value)
        }
        const onChangePorch = (e: ChangeEvent<HTMLInputElement>) => {
            setPorch(e.target.value)
        }
        const onChangeFloor = (e: ChangeEvent<HTMLInputElement>) => {
            setFloor(e.target.value)
        }

        return (
            <>
                <div className='delivery-modal__map'>
                    {type === TOrderType.DELIVERY && (
                        <DeliveryContent
                            locality={locality}
                            onSwitchToPickup={handleSwitchToPickup}
                            scrollBottom={scrollBottom}
                            deliveryLocationCoords={deliveryLocationCoords}
                            setDeliveryLocationCoords={setDeliveryLocationCoords}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            deliveryPossible={deliveryPossible}
                            setDeliveryPossible={setDeliveryPossible}
                            deliveryZonesRef={deliveryZonesRef}
                            mapRef={mapRef}
                        />
                    )}

                    {type === TOrderType.PICKUP && (
                        <PickupContent
                            locality={locality}
                            selectRestaurant={setRestaurantInfo}
                            handlePlacemarkRef={handlePlacemarkRef}
                            selectedRestaurant={selectedRestaurant}
                            setSelectedRestaurant={setSelectedRestaurant}
                        />
                    )}
                </div>
                <div className='delivery-modal__content d-flex flex-column'>
                    {
                        <div className={styles.orderTypeSelect}>
                            <OrderTypeSelect onChange={handleTypeChange} type={type} />
                        </div>
                    }

                    {type === TOrderType.PICKUP && (
                        <Typography className={styles.restaurantSelectHeader}>
                            Выберите ресторан для самовывоза
                        </Typography>
                    )}

                    {/*
                    // Выбор города
                    {localities.length > 1 && !restaurantClosed && (
                        <div className={styles.localitySelect}>
                            <LocalitySelect
                                localities={localities}
                                onChange={handleLocalityChange}
                                selectedLocalityId={locality.id}
                            />
                        </div>
                    )} */}

                    {type === TOrderType.DELIVERY && (
                        <form onSubmit={handleButtonClick}>
                            <LocationInput
                                // remount location input when locality has been changed
                                // to clear search query and suggestions
                                key={locality.id}
                                borderBox={localityBorderBox}
                                coordinates={{
                                    latitude: locality.latitude,
                                    longitude: locality.longitude,
                                }}
                                locality={locality}
                                onChange={handleInputChange}
                                onSelect={handleInputSuggestionClick}
                                value={inputValue}
                            />

                            <div className='delivery-modal__fields d-flex flex-wrap'>
                                <div className='delivery-modal__field d-flex'>
                                    <label className='delivery-modal__field-inner'>
                                        <span className='delivery-modal__field-label'>Кв/оф</span>
                                        <input
                                            name='apartment'
                                            type='text'
                                            className='delivery-modal__field-input'
                                            value={apartment}
                                            onChange={onChangeApartment}
                                        />
                                    </label>
                                </div>

                                <div className='delivery-modal__field d-flex'>
                                    <label className='delivery-modal__field-inner'>
                                        <span className='delivery-modal__field-label'>Домофон</span>
                                        <input
                                            name='doorCode'
                                            type='text'
                                            className='delivery-modal__field-input'
                                            value={doorCode}
                                            onChange={onChangeDoorCode}
                                        />
                                    </label>
                                </div>

                                <div className='delivery-modal__field d-flex'>
                                    <label className='delivery-modal__field-inner'>
                                        <span className='delivery-modal__field-label'>Подъезд</span>
                                        <input
                                            type='text'
                                            className='delivery-modal__field-input'
                                            name='porch'
                                            value={porch}
                                            onChange={onChangePorch}
                                        />
                                    </label>
                                </div>

                                <div className='delivery-modal__field d-flex'>
                                    <label className='delivery-modal__field-inner'>
                                        <span className='delivery-modal__field-label'>Этаж</span>
                                        <input
                                            name='floor'
                                            type='text'
                                            className='delivery-modal__field-input'
                                            value={floor}
                                            onChange={onChangeFloor}
                                        />
                                    </label>
                                </div>
                            </div>

                            <Button
                                className={styles.deliverHere}
                                disabled={deliveryLocationCoords === null || inputValue == ''}
                                // onClick={handleButtonClick}
                                size='medium'
                            >
                                Сохранить
                            </Button>
                        </form>
                    )}

                    {type === TOrderType.PICKUP && (
                        <>
                            <div className='delivery-modal__restaurants'>
                                {locality.restaurants.map(({ id, name, address }: TRestaurant) => (
                                    <label key={id} className='restaurant'>
                                        <input
                                            checked={selectedRestaurant?.id === id}
                                            type='radio'
                                            className='restaurant__input'
                                            name='restaurant'
                                            onChange={onRestaurantClick(id)}
                                        />
                                        <div className='restaurant__inner d-flex items-center transition'>
                                            <div className='restaurant__inner-check circle-center transition'>
                                                <span className='icon-check'></span>
                                            </div>
                                            <div className='restaurant__inner-info d-flex flex-column'>
                                                <span className='restaurant__inner-title'>
                                                    {name} - {address}
                                                </span>
                                                <span className='restaurant__inner-text'>Онлайн оплата на сайте</span>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                                <Button
                                    className={styles.selectButton}
                                    onClick={handleButtonRestaurantClick}
                                    size='medium'
                                >
                                    Подтвердить
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </>
        )
    },
    false,
    yandexMapsModules,
) as FC<Props>

export default RestaurantSelectModalMap
