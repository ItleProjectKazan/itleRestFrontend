import { TDayOfWeek } from '~/types/misc'

export type TCategory = {
    id: number
    name: string
    text: string
    code: string
    icon: string
    image: string
    category_name: string
    is_visible: boolean
    title: string
    description: string
    seo_title: string
    seo_description: string
    availability_schedule: Record<
        TDayOfWeek,
        {
            from: string
            to: string
        }[]
    >
}

export enum TModifierControlType {
    STEPPER = 'stepper',
    STEPPER_OUTLINED = 'stepper-outlined',
    SELECT = 'select',
    CHECKBOXES = 'checkboxes',
}

export type TModifierGroup = {
    id: number
    control_type: TModifierControlType
    modifiers: {
        id: number
        name: string
        price: number
        weight: number
        order: number
        energy_amount: number
        protein_amount: number
        fat_amount: number
        carbohydrate_amount: number
        fiber_amount: number
    }[]
    min_amount: number
    max_amount: number
    name: string | null
    default_amount: number
    is_required: boolean
}

export type TModifier = {
    id: number
    name: string
    price: number
    min_amount: number
    max_amount: number
    default_amount: number
    weight: number
    energy_amount: number
    protein_amount: number
    fat_amount: number
    carbohydrate_amount: number
    fiber_amount: number
}

export type TProduct = {
    id: number
    category_id: number
    name: string
    description: string
    additional_info?: string
    image_url: string | null
    nova_image: string | null
    price: number
    discount: number | null
    protein_amount: number
    carbohydrate_amount: number
    fat_amount: number
    fiber_amount: number
    energy_amount: number
    weight: number
    order: number
    sort: number
    is_new: boolean
    is_pinned: boolean
    group_modifiers: TModifierGroup[]
    modifiers: TModifier[]
    dont_apply_discount: boolean
}
