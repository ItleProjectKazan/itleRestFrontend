import { TDeliveryDetails } from '~/store/models/OrderParams'

export type { TDeliveryZone } from '~/store/models/DeliveryZone'
export type { TEnvironment } from '~/store/models/Environment'
export type { TLocality } from '~/store/models/Locality'
export type { TOpeningHours, TRestaurant } from '~/store/models/Restaurant'
export type { TUser } from '~/store/models/User'
export type { TDeliveryDetails, TOrderParams } from '~/store/models/OrderParams'

export type TDayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export type TCoords = {
    latitude: number
    longitude: number
}

export type TLinks = {
    title: string
    link: string
}

export type TSelectedRestaurantInfo = {
    id: number
    delivery_zone_id: number
    delivery_details: TDeliveryDetails | null
}

export enum TBannerType {
    DESKTOP = 'desktop',
    MOBILE = 'mobile',
}

export type TBanner = {
    id: number
    type: TBannerType
    background_image: string | null
    title: string | null
    subtitle: string | null
    button_label: string | null
    url: string | null
    image: string | null
    mobile_image: string | null
    backgroundImage: string | null
    mobile_background_image: string | null
    icon_one: string | null
    icon_one_description: string | null
    icon_two: string | null
    icon_two_description: string | null
    icon_three: string | null
    icon_three_description: string | null
}

export type TAddressComponents = {
    locality: string
    street: string
    house: string
}

export type TPageData = {
    page_name: string | null
    SEO_title: string | null
    SEO_description: string | null
    slug: string | null
    content: string | null
    preview_image: string | null
    image_url: string
    preview_text: string | null
    slider_images: []
}

export type TPromo = {
    page_name: string | null
    SEO_title: string | null
    SEO_description: string | null
    slug: string | null
    content: string | null
    preview_image: string | null
    preview_text: string | null
    image_url: string
    button: string | null
    button_link: string | null
    slider_images: []
}

export type TDeliveryLocationCoords = {
    type: 'search' | 'map-click'
    address: {
        locality: string
        province: string
        street: string
        house: string
    } | null
    latitude: number
    longitude: number
} | null

export type TSeoTitle = {
    seo_title: string
    seo_description: string
}
