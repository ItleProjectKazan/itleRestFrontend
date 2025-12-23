/* eslint-disable no-useless-escape */
/* eslint-disable no-async-promise-executor */
import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import { observer } from 'mobx-react-lite'
import { QueryClient, useQuery } from 'react-query'

import { smoothScrollToElement } from '~/helpers/smoothScroll'

import { useForm } from 'react-hook-form'

import { usePrevious } from '~/hooks'

import { http } from '~/core/axios'
import { findLocalityByRestaurant, parseRestaurantCookie } from '~/helpers'
import { useCart, useStore } from '~/hooks'
import { fetchCart, CART_QUERY_KEY } from '~/hooks/useCart'
import { TBanner, TBannerType, TLocality, TRestaurant } from '~/types/misc'

import { Layout, Section } from '~/components'
import { TOrderType } from '~/types/order'
import { TProduct } from '~/types/catalog'
import { TCartResponse } from '~/services/cart'

import { RESTAURANT_COOKIE } from '~/constants/misc'
import { ApiEndpoints } from '~/constants/apiEndpoints'

import { LocalitySelect } from '~/components/RestaurantSelectModal/LocalitySelect'

// import { ContactsMap } from './ContactsMap/ContactsMap'
import { TableReserve } from './TableReserve/TableReserve'

import styles from './Hall.module.scss'
import { QUERY_KEYS } from '../home/constants'
import { getBanners } from '~/services/queries'
// import { Banner } from './../home/Banner/Banner'
import { HeaderBlocks } from './HeaderBlocks/HeaderBlocks'
import { Info } from './Info/Info'
import { HallPhotos } from './HallPhotos/HallPhotos'
import Image from 'next/legacy/image'
import { AvailableHalls } from './AvailableHalls/AvailableHalls'
import classNames from 'classnames'
import { HeaderBanner } from './HeaderBanner/HeaderBanner'
import ym from 'react-yandex-metrika'

const API_TYPE = process.env.NEXT_TYPE

const normalizePhone = (phoneNumber: string) => {
    return phoneNumber.replace(/[^0-9+]/g, '')
}

const denormalizePhone = (phoneNumber: string) => {
    const matches = phoneNumber.match(/^(\+7)(\d{3})(\d{3})(\d{2})(\d{2})$/)
    const denormalizedPhone = matches
        ? '+7 ' + '(' + matches[2] + ')' + ' ' + matches[3] + ' - ' + matches[4] + ' - ' + matches[5]
        : ''

    return denormalizedPhone
}

interface Props {
    recommendedProducts: TProduct[]
    restaurantId: number
}

const Hall: NextPage<Props> = observer(({ restaurantId, recommendedProducts }) => {
    const cart = useCart()

    const { localities, orderParams, successfullReserveModal, user } = useStore()

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

    const [order_date, setOrderDate] = useState<any>(false)
    const [order_time, setOrderTime] = useState<any>(false)
    const [isOrdering, setIsOrdering] = useState(false)

    const {
        formState: { errors: formErrors },
        getFieldState,
        getValues,
        register: registerField,
        setValue: setFieldValue,
        trigger: triggerValidation,
    } = useForm({
        defaultValues: {
            customer_name: user?.name ?? '',
            phone_number: user?.phone_number ? denormalizePhone(user?.phone_number) : '',
            date: new Date(),
        },
    })

    const formData = getValues()
    const fields: Record<keyof typeof formData, any> = {
        customer_name: registerField('customer_name', {
            pattern: /.{1,32}/,
            required: true,
        }),
        phone_number: registerField('phone_number', {
            pattern: /^\+7\s\(\d\d\d\)\s\d\d\d\s-\s\d\d\s-\s\d\d$/g,
            required: true,
        }),
        date: registerField('date'),
        // people_count: registerField('people_count'),
        // comment: registerField('comment'),
    }

    const inputRefs = useRef<Record<keyof typeof formData, HTMLElement | null>>({
        customer_name: null,
        phone_number: null,
        date: null,
    })

    // const [people_count, setPeopleCount] = useState(() => {
    //     return getValues().people_count
    // })

    const locality = useMemo(() => {
        return localities.find((locality) => locality.id === localityId) as TLocality
    }, [localities, localityId])

    const [selectedRestaurant, setSelectedRestaurant] = useState<TRestaurant | null>(() => {
        return locality.restaurants.find((restaurant) => restaurant.id === orderParams.restaurantId) ?? null
    })

    const prevRestaurant = usePrevious(selectedRestaurant)

    // reset location when locality is changed
    useEffect(() => {
        if (prevRestaurant !== selectedRestaurant && prevRestaurant !== null) {
            setOrderDate(false)
            setOrderTime(false)
        }
    }, [selectedRestaurant, prevRestaurant])

    const handleLocalityChange = useCallback(
        (localityId: number) => {
            cart.clear()

            setLocalityId(localityId)
        },
        [cart],
    )

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

    useEffect(() => {
        // this case is possible when a user selected some locality
        // and then opened another locality by URL
        // so we need to changed selected restaurant to default restaurant of the current locality
        if (orderParams.restaurantId !== null && restaurantId !== orderParams.restaurantId) {
            orderParams.setRestaurant(orderParams.orderType as TOrderType, {
                id: restaurantId as number,
                delivery_zone_id: null,
                delivery_details: null,
            })
        }
    }, [restaurantId, orderParams])

    useEffect(() => {
        // select default restaraunt
        if (orderParams.restaurantId == null) {
            if (localities.length == 1) {
                const locality = findLocalityByRestaurant(localities, restaurantId)
                if (locality) {
                    if (locality.restaurants.length == 1) {
                        const selectedRestaurant =
                            locality.restaurants.find((restaurant) => restaurant.id === restaurantId) ?? null
                        if (selectedRestaurant) {
                            const pickupDeliveryZone = selectedRestaurant.delivery_zones.find((zone) => {
                                return zone.type === TOrderType.PICKUP
                            })

                            if (pickupDeliveryZone === undefined) {
                                throw new Error(
                                    `Pickup delivery zone doesnt\'t exist in restaurant #${selectedRestaurant.id}`,
                                )
                            }

                            cart.selectRestaurant(TOrderType.PICKUP, {
                                id: restaurantId as number,
                                delivery_zone_id: pickupDeliveryZone.id,
                                delivery_details: null,
                            })

                            cart.createCart()
                        }
                    }
                }
            }
        }
    }, [cart, localities, orderParams, restaurantId])

    const validateForms = async () => {
        return new Promise(async (resolve) => {
            await triggerValidation()

            const invalidFieldRefs: HTMLElement[] = [
                ...(Object.keys(inputRefs.current)
                    .map((nameStr: any) => {
                        const name = nameStr as keyof typeof formData

                        return getFieldState(name).invalid ? inputRefs.current[name] : null
                    })
                    .filter((el) => el !== null) as HTMLElement[]),
            ]

            // scroll to the first invalid field
            if (invalidFieldRefs.length > 0) {
                ///smoothScrollToElement(invalidFieldRefs[0], { duration: 3000, offsetTop: 100, offsetLeft: 0 })
            }

            resolve(invalidFieldRefs.length === 0)
        })
    }

    const submitForm = async () => {
        setIsOrdering(true)
        const formData = getValues()
        const isValid = await validateForms()

        if (!isValid) {
            setIsOrdering(false)

            return
        }

        try {
            await http.post(ApiEndpoints.ORDER_HALL, {
                name: formData.customer_name,
                date: formData.date ?? '',
                people_count: 1, // wtf
                phone_number: normalizePhone(formData.phone_number),
                comment: formData.date ?? '',
                restaurant_id: selectedRestaurant?.id,
                // date: order_date.value,
                time: order_time.value,
            })

            // ym('reachGoal', 'reserve')

            successfullReserveModal.open()
        } catch (error: any) {
            console.log(error)
            setIsOrdering(false)
        }
    }

    const title = 'ИТЛЕ СТЕЙК КАФЕ'

    const DEFAULT_EMPTY_LIST = [] as const
    const banners =
        useQuery<TBanner[]>(QUERY_KEYS.BANNERS(undefined), () => getBanners(undefined), {
            refetchOnWindowFocus: false,
        }).data ?? (DEFAULT_EMPTY_LIST as any as TBanner[])
    const desktopBanners = useMemo(() => {
        return banners.filter((banner) => banner.type === TBannerType.DESKTOP)
    }, [banners])

    const images: JSX.Element[] = [
        <Image key='1' alt='' layout='fill' objectFit='cover' src={'/images/hall/onlyhall/1.jpg'} />,
        <Image key='2' alt='' layout='fill' objectFit='cover' src={'/images/hall/onlyhall/2.jpg'} />,
        <Image key='3' alt='' layout='fill' objectFit='cover' src={'/images/hall/onlyhall/3.jpg'} />,
        <Image key='4' alt='' layout='fill' objectFit='cover' src={'/images/hall/onlyhall/4.jpg'} />,
        <Image key='5' alt='' layout='fill' objectFit='cover' src={'/images/hall/onlyhall/5.jpg'} />,
        <Image key='6' alt='' layout='fill' objectFit='cover' src={'/images/hall/onlyhall/6.jpg'} />,
        <Image key='7' alt='' layout='fill' objectFit='cover' src={'/images/hall/onlyhall/7.jpg'} />,
        <Image key='8' alt='' layout='fill' objectFit='cover' src={'/images/hall/onlyhall/8.jpg'} />,
        <Image key='9' alt='' layout='fill' objectFit='cover' src={'/images/hall/onlyhall/9.jpg'} />,
        <Image key='10' alt='' layout='fill' objectFit='cover' src={'/images/hall/onlyhall/10.jpg'} />,
    ]

    const [date, setDate] = useState(() => {
        return getValues().date
    })

    return (
        <Layout description={title} recommendedProducts={recommendedProducts} title={title}>
            <HeaderBanner />

            <HeaderBlocks />

            <Info />

            <HallPhotos images={images} id={0} />

            <AvailableHalls
                locality={locality}
                selectedRestaurant={selectedRestaurant}
                setSelectedRestaurant={setSelectedRestaurant}
            />

            {/* <div className="container">
                <h1 className={ styles.title }>Бронирование банкетных залов</h1>
                <div className={ styles.introBlock }>
                    <p>У нас два зала – малый и большой. Большой рассчитан на 30 человек. Торжественная обстановка прекрасно подойдет для крупных торжеств. Например, никаха.</p>
                    <p>В малом комфортно разместятся 15 человек. Современный, удобный дизайн, идеально для семейной встречи или важных деловых переговоров.</p>
                    <p>И в каждом из этих залов мы будем рады сделать все, чтобы вы запомнили только вкусную еду, качественное обслуживание и, главное, ощущение праздника.</p>
                </div>
            </div> */}
            {localities.length > 1 && (
                <div className='container'>
                    <div className={styles.localitySelect}>
                        <LocalitySelect
                            localities={localities}
                            onChange={handleLocalityChange}
                            selectedLocalityId={locality.id}
                        />
                    </div>
                </div>
            )}
            <div id='reserve_section'></div>
            <Section className={classNames(styles.contactsBody)}>
                {/* <div className={ styles.contactsBody }> */}
                {/* <div className={ styles.contactsLeftBlock }>
                        <ContactsMap
                            locality={ locality }
                            selectedRestaurant={ selectedRestaurant }
                            setSelectedRestaurant={ setSelectedRestaurant }
                        />
                    </div> */}
                {/* <div className={ styles.contactsRightBlock }> */}
                {selectedRestaurant && (
                    <TableReserve
                        fields={fields}
                        formData={formData}
                        formErrors={formErrors}
                        inputRefs={inputRefs}
                        isOrdering={isOrdering}
                        locality={locality}
                        order_date={order_date}
                        order_time={order_time}
                        selectedRestaurant={selectedRestaurant}
                        setOrderDate={setOrderDate}
                        setOrderTime={setOrderTime}
                        setSelectedRestaurant={setSelectedRestaurant}
                        submitForm={submitForm}
                        setFieldValue={setFieldValue}
                        setDate={setDate}
                        date={date}
                    />
                )}
                {/* </div> */}
                {/* </div> */}
            </Section>
        </Layout>
    )
})

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { params, req } = ctx
    const cookies = (req?.cookies ?? {}) as Record<string, string>

    const queryClient = new QueryClient()

    const cart = (await queryClient.fetchQuery<TCartResponse>(CART_QUERY_KEY, fetchCart)).cart

    const localities = (await http.get<TLocality[]>(ApiEndpoints.RESTAURANTS)).data
    const cookieRestaurant =
        cookies[RESTAURANT_COOKIE] !== undefined ? parseRestaurantCookie(req.cookies[RESTAURANT_COOKIE] || '') : null
    const restaurantId = cart !== null ? cart.restaurant_id : (cookieRestaurant?.id ?? null)

    const retaurantLocality = restaurantId ? findLocalityByRestaurant(localities, restaurantId) : false
    const locality =
        restaurantId && retaurantLocality
            ? retaurantLocality
            : (localities.find((locality) => locality.is_default) ?? localities[0])

    if (locality === undefined || locality.restaurants.length === 0 || API_TYPE !== 'bistro') {
        return {
            notFound: true,
        }
    }

    let restaurant = locality.restaurants.find((restaurant) => {
        return restaurant.id === restaurantId
    })

    if (restaurant === undefined) {
        restaurant = locality.restaurants.find((locality) => locality.is_default) ?? locality.restaurants[0]
    }

    const [recommendedProducts] = await Promise.all([
        http.get<TProduct[]>(ApiEndpoints.CART_RECOMMENDED_PRODUCTS, {
            params: {
                cart_id: cookies.cart_id,
                restaurant_id: restaurant?.id,
            },
        }),
    ])

    return {
        props: {
            localitySlug: params?.localitySlug ?? null,
            recommendedProducts: recommendedProducts.data,
            restaurantId: restaurant.id,
        },
    }
}

export default Hall
