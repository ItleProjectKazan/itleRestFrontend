import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { YMaps } from '@pbe/react-yandex-maps'
import { useCart, usePrevious, useStore } from '~/hooks'
import { Modal } from '~/components'
import { TLocality, TSelectedRestaurantInfo } from '~/types/misc'
import { TOrderType } from '~/types/order'
import styles from './RestaurantSelectModal.module.scss'
import RestaurantSelectModalMap from './RestaurantSelectModalMap'

interface Props {
    deliveryType: string
    open: boolean
    onClose: () => void
}

const RestaurantSelectModal: FC<Props> = observer(({ deliveryType, onClose, open }) => {
    const { localities, orderParams } = useStore()
    const cart = useCart()
    const modalRef = useRef<HTMLElement | null>(null)
    const [type, setType] = useState<TOrderType>(orderParams.orderType as TOrderType)
    // обновляем тип по внешним изменениям
    useEffect(() => {
        if (open) {
            setType(deliveryType !== '' ? (deliveryType as TOrderType) : (orderParams.orderType as TOrderType))
        }
    }, [open, deliveryType, orderParams.orderType])

    const [localityId, setLocalityId] = useState<number | null>(() => {
        const locality = localities.find((locality) => locality.is_default) ?? localities[0]
        if (orderParams.localityId !== null) {
            const localityExists = localities.find((locality) => {
                return locality.id === orderParams.localityId
            })
            return localityExists ? orderParams.localityId : locality.id
        }
        return locality.id
    })
    const [restaurantInfo, setRestaurantInfo] = useState<TSelectedRestaurantInfo | null>(null)

    const handleTypeChange = useCallback((type: TOrderType) => {
        setType(type)
    }, [])

    const handleSwitchToPickup = useCallback(() => {
        setType(TOrderType.PICKUP)
    }, [])

    const handleLocalityChange = useCallback(
        (localityId: number) => {
            setLocalityId(localityId)
        },
        [cart],
    )

    const handleClose = useCallback(() => {
        setRestaurantInfo(null)
        onClose()
    }, [])

    const prevOpenStatus = usePrevious(open)

    useEffect(() => {
        if (prevOpenStatus == true && open == false) {
            const locality = localities.find((locality) => locality.is_default) ?? localities[0]
            if (orderParams.localityId !== null) {
                const localityExists = localities.find((locality) => {
                    return locality.id === orderParams.localityId
                })
                setLocalityId(localityExists ? orderParams.localityId : locality.id)
            }
        }
    }, [setRestaurantInfo, localities, open, orderParams, prevOpenStatus])

    const locality = localities.find((locality) => locality.id === localityId) as TLocality

    // const locality = useMemo(() => {
    //     return localities.find((locality) => locality.id === localityId) as TLocality
    // }, [localities, localityId])

    const restaurant = useMemo(() => {
        if (restaurantInfo === null) {
            return null
        }
        return locality.restaurants.find((restaurant) => restaurant.id === restaurantInfo.id) ?? null
    }, [locality, restaurantInfo])

    const restaurantClosed = useMemo(() => {
        if (restaurant === null) {
            return false
        }

        return !restaurant.isOpen
    }, [restaurant])

    useEffect(() => {
        if (restaurantInfo !== null) {
            cart.selectRestaurant(type, restaurantInfo)
            handleClose()
        }
    }, [restaurantInfo, type])
    // }, [cart, handleClose, localityId, restaurantClosed, restaurantInfo, orderParams, type])

    const scrollBottom = useCallback(() => {
        if (modalRef.current !== null) {
            modalRef.current.scrollTop = modalRef.current.scrollHeight
        }
    }, [])

    const getApiKey = (): string => {
        const apiKeysString = process.env.NEXT_PUBLIC_YANDEX_GEOCODER_KEY
        const apiKeysArray = apiKeysString?.split('|')
        return apiKeysArray === undefined ? '' : apiKeysArray[Math.floor(Math.random() * apiKeysArray.length)]
    }

    const getSuggestApiKey = () => {
        const apiKeysString = process.env.NEXT_PUBLIC_YANDEX_SUGGEST_KEY
        if (!apiKeysString) return
        const apiKeysArray = apiKeysString?.split('|')
        if (!apiKeysArray) return
        return apiKeysArray === undefined ? '' : apiKeysArray[Math.floor(Math.random() * apiKeysArray.length)]
    }

    const localityBorderBox = useMemo(
        () => ({
            lowerCorner: locality.border_box_lower_corner,
            upperCorner: locality.border_box_upper_corner,
        }),
        [locality],
    )

    return (
        <Modal ref={modalRef} className={styles.modal} onClose={onClose} open={open}>
            <div className='delivery-modal d-flex'>
                <YMaps
                    preload
                    query={{
                        apikey: getApiKey(),
                        suggest_apikey: getSuggestApiKey(),
                    }}
                >
                    <RestaurantSelectModalMap
                        type={type}
                        localities={localities}
                        localityBorderBox={localityBorderBox}
                        orderParams={orderParams}
                        handleTypeChange={handleTypeChange}
                        handleSwitchToPickup={handleSwitchToPickup}
                        locality={locality}
                        restaurantClosed={restaurantClosed}
                        scrollBottom={scrollBottom}
                        setRestaurantInfo={setRestaurantInfo}
                        handleLocalityChange={handleLocalityChange}
                        selectRestaurant={setRestaurantInfo}
                    />
                </YMaps>
            </div>
        </Modal>
    )
})

export { RestaurantSelectModal }
