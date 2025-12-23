import { TRestaurant } from '../misc'

export type TPagePreview<T> = { content_pages: T; count: number }
export type TPage<T> = { content_page: T; count: number }

export type TEstablishment = {
    id?: string
    main_title?: string
    main_description?: string
    address?: string
    image?: string
    restaurant_id?: number
}

type TEstablishmentBlock = {
    main_title?: string
    main_description?: string
    description?: string
    address?: string
    image?: string
    slider?: string[]
}

export type TEstablishmentCard = {
    id: number
    title: string
    image: string
    first: TEstablishmentBlock
    second: TEstablishmentBlock
    third: TEstablishmentBlock
    forth: TEstablishmentBlock
    fifth: TEstablishmentBlock
    sixth: TEstablishmentBlock
    restaurant: TRestaurant
    seo: {
        seo_title: string
        seo_description: string
    }
}
