import { TProduct, TCategory } from '~/types/catalog'

export type TCategoryPage = {
    category: TCategory
    products: TProduct[]
}

export type TCategoryPageMenuItem = {
    id: number
    code: string
    name: string
}
