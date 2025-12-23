import { TDayOfWeek } from '~/types/misc'
export type TNews = {
    id: string
    title: string
    image: string
    date: string
    updated_at: string
    availability_schedule: Record<
        TDayOfWeek,
        {
            from: string
            to: string
        }[]
    >
}

export type TNewsItem = {
    id?: string
    main_title?: string
    title?: string
    slider?: string[]
    text?: string
    title_with_background?: string
    text_with_background?: string
}

export type TNewsCard = {
    date?: string
    updated_at?: string
    seo_title?: string
    seo_description?: string
} & Record<'first' | 'second' | 'third' | 'fourth' | 'fifth' | 'sixth' | 'seventh' | 'text', TNewsItem>
