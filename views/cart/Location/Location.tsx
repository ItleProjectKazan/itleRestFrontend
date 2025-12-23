import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { observer } from 'mobx-react-lite'

import { /*useCurrentLocality,*/ useStore } from '~/hooks'
// import { findLocalityByRestaurant } from '~/helpers'

import { FormGroup, TextInput } from '~/components'
import { OrderTypeSelect } from '~/components/Inputs/OrderTypeSelect'

import { TDeliveryAddress, TOrderType } from '~/types/order'

import styles from './Location.module.scss'

export type LocationHandle = {
    getFormData: () => TDeliveryAddress
    getInvalidFields: () => HTMLElement[]
    triggerFormValidation: () => Promise<boolean>
}

const Location = observer<{}, LocationHandle>(
    (props, ref) => {
        const { orderParams, restaurantSelectModal } = useStore()
        //const restaurantId = orderParams !== null ? orderParams.restaurantId : null
        //const currentLocality = useCurrentLocality()
        ///const locality = restaurantId ? findLocalityByRestaurant(localities, restaurantId) : currentLocality

        const deliveryAddress = useMemo(() => {
            return {
                locality: orderParams.deliveryDetails?.locality ?? '',
                province: orderParams.deliveryDetails?.province ?? '',
                street: orderParams.deliveryDetails?.street ?? '',
                house: orderParams.deliveryDetails?.house ?? '',
                apartment: orderParams.deliveryDetails?.apartment ?? '',
                door_code: orderParams.deliveryDetails?.door_code ?? '',
                porch: orderParams.deliveryDetails?.porch ?? '',
                floor: orderParams.deliveryDetails?.floor ?? '',
            }
        }, [
            orderParams.deliveryDetails?.street,
            orderParams.deliveryDetails?.house,
            orderParams.deliveryDetails?.locality,
            orderParams.deliveryDetails?.province,
        ])

        const {
            getValues,
            formState: { errors },
            register,
            trigger: triggerValidation,
            setValue,
        } = useForm<TDeliveryAddress>({
            defaultValues: {
                locality: deliveryAddress.locality,
                province: deliveryAddress.province,
                street: deliveryAddress.street,
                house: deliveryAddress.house,
                apartment: deliveryAddress.apartment,
                porch: deliveryAddress.porch,
                door_code: deliveryAddress.door_code,
                floor: deliveryAddress.floor,
            },
        })

        useEffect(() => {
            setValue('street', deliveryAddress.street)
            setValue('house', deliveryAddress.house)
            setValue('locality', deliveryAddress.locality)
            setValue('province', deliveryAddress.province)
            setValue('apartment', deliveryAddress.apartment)
            setValue('porch', deliveryAddress.porch)
            setValue('door_code', deliveryAddress.door_code)
            setValue('floor', deliveryAddress.floor)
        }, [deliveryAddress, setValue])

        const fields: Record<keyof TDeliveryAddress, any> = {
            street: register('street', { required: true }),
            house: register('house', { required: true }),
            apartment: register('apartment'),
            porch: register('porch'),
            door_code: register('door_code'),
            floor: register('floor'),
            locality: register('locality'),
            province: register('province'),
        }

        const inputRefs = useRef<Record<keyof TDeliveryAddress, HTMLElement | null>>({
            street: null,
            house: null,
            apartment: null,
            porch: null,
            door_code: null,
            floor: null,
            locality: null,
            province: null,
        })

        useImperativeHandle(
            ref,
            () => ({
                getFormData: getValues,
                getInvalidFields: () => {
                    return Object.keys(errors)
                        .map((name: any) => inputRefs.current[name as keyof TDeliveryAddress])
                        .filter((el) => el !== null) as HTMLElement[]
                },
                triggerFormValidation: triggerValidation,
            }),
            [errors, getValues, triggerValidation],
        )

        const handleSetOrderType = useCallback(
            (deliveryType: string) => {
                const setDeliveryType =
                    deliveryType === TOrderType.DELIVERY
                        ? 'delivery'
                        : deliveryType === TOrderType.PICKUP
                          ? 'pickup'
                          : ''
                restaurantSelectModal.open(setDeliveryType)
            },
            [restaurantSelectModal],
        )

        const pickupPoint = useMemo(() => {
            const point = {
                address: '',
                name: '',
            }

            if (orderParams.restaurant !== null) {
                point.address = orderParams.restaurant.address
                point.name = orderParams.restaurant.name
            }

            return point
        }, [orderParams.restaurant])

        return (
            <div>
                <OrderTypeSelect
                    className='checkout-page__delivery'
                    onChange={handleSetOrderType}
                    type={orderParams.orderType as TOrderType}
                />
                {orderParams.orderType === TOrderType.PICKUP && (
                    <div className={styles.addressForm}>
                        <FormGroup className={styles.addressFields}>
                            <div className={styles.width100}>
                                <TextInput
                                    className={'grid-wide'}
                                    defaultValue={pickupPoint.address}
                                    onClick={() => restaurantSelectModal.open('pickup')}
                                    placeholder='Ресторан самовывоза'
                                    readOnly
                                    value={pickupPoint.address}
                                    showLabel
                                />
                            </div>
                        </FormGroup>
                    </div>
                )}
                {orderParams.orderType === TOrderType.DELIVERY && (
                    <div className='checkout-page__fields'>
                        {/* <Typography className="mb-12" size={22} weight="bold">
                        Адрес {locality !== null ? <span className={styles.localityTitle}>{locality?.name}</span> : null}
                    </Typography> */}
                        <FormGroup>
                            <div className={styles.addressFields}>
                                <div className={styles.width40}>
                                    <TextInput
                                        {...fields.street}
                                        ref={(ref) => {
                                            inputRefs.current.street = ref
                                            fields.street.ref(ref)
                                        }}
                                        className={'grid-wide'}
                                        error={errors.street !== undefined}
                                        onClick={() => restaurantSelectModal.open('delivery')}
                                        pattern='.{1,128}'
                                        placeholder='Улица'
                                        readOnly
                                        showLabel
                                    />
                                </div>
                                <div className={styles.width20}>
                                    <TextInput
                                        {...fields.house}
                                        ref={(ref) => {
                                            inputRefs.current.house = ref
                                            fields.house.ref(ref)
                                        }}
                                        error={errors.house !== undefined}
                                        onClick={() => restaurantSelectModal.open('delivery')}
                                        pattern='[^\s]{1,5}'
                                        placeholder='Дом'
                                        readOnly
                                        showLabel
                                    />
                                </div>
                                <div className={styles.width20}>
                                    <TextInput
                                        {...fields.apartment}
                                        ref={(ref) => {
                                            inputRefs.current.apartment = ref
                                            fields.apartment.ref(ref)
                                        }}
                                        error={errors.apartment !== undefined}
                                        pattern='[0-9]{1,4}'
                                        placeholder='Квартира'
                                        showLabel
                                    />
                                </div>
                                <div className={styles.width20}>
                                    <TextInput
                                        {...fields.porch}
                                        ref={(ref) => {
                                            inputRefs.current.porch = ref
                                            fields.porch.ref(ref)
                                        }}
                                        error={errors.porch !== undefined}
                                        pattern='[0-9]{1,2}'
                                        placeholder='Подъезд'
                                        showLabel
                                    />
                                </div>
                                <div className={styles.width20}>
                                    <TextInput
                                        {...fields.door_code}
                                        ref={(ref) => {
                                            inputRefs.current.door_code = ref
                                            fields.door_code.ref(ref)
                                        }}
                                        error={errors.door_code !== undefined}
                                        pattern='[\d\w]{1,7}'
                                        placeholder='Код двери'
                                        showLabel
                                    />
                                </div>
                                <div className={styles.width20}>
                                    <TextInput
                                        {...fields.floor}
                                        ref={(ref) => {
                                            inputRefs.current.floor = ref
                                            fields.floor.ref(ref)
                                        }}
                                        error={errors.floor !== undefined}
                                        pattern='[0-9]{1,2}'
                                        placeholder='Этаж'
                                        showLabel
                                    />
                                </div>
                            </div>
                        </FormGroup>
                    </div>
                )}
            </div>
        )
    },
    {
        forwardRef: true,
    },
)

Location.displayName = 'Delivery'

export { Location }
