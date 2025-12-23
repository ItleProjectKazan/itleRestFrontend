import { http } from '~/core/axios'
import { TBanner } from '~/types/misc'
import { TCategory, TProduct } from '~/types/catalog'
import { TNews } from '~/types/pages/news'
import { TTripleSlider } from '~/types/triple_slider'
import { ApiEndpoints } from '~/constants/apiEndpoints'
import { TPagePreview, TPage } from '~/types/pages/page'

export const NEXT_SERVER = process.env.NEXT_SERVER

export const getBanners = async (restaurantId: number | undefined) =>
    (
        await http.get<TBanner[]>(ApiEndpoints.BANNERS, {
            params: {
                restaurant_id: restaurantId,
            },
        })
    ).data

export const getCategories = async (restaurantId: number | undefined) =>
    (
        await http.get<TCategory[]>(ApiEndpoints.CATEGORIES, {
            params: {
                restaurant_id: restaurantId,
            },
        })
    ).data

export const getPopularProducts = async (restaurantId: number | undefined) =>
    (
        await http.get<TProduct[]>(ApiEndpoints.POPULAR_PRODUCTS, {
            params: {
                restaurant_id: restaurantId,
            },
        })
    ).data

export const getProducts = async (restaurant_id: number | undefined) =>
    (
        await http.get<TProduct[]>(ApiEndpoints.PRODUCTS, {
            params: {
                restaurant_id,
            },
        })
    ).data

export const getRecomendedProducts = async (cart_id: string, restaurant_id?: number) =>
    (
        await http.get<TProduct[]>(ApiEndpoints.CART_RECOMMENDED_PRODUCTS, {
            params: {
                cart_id,
                restaurant_id,
            },
        })
    ).data

export const getNews = async () => (await http.get<{ news: TNews[] }>(ApiEndpoints.NEWS)).data.news

export const getTripleSlider = async () => (await http.get<TTripleSlider>(ApiEndpoints.TRIPLE_SLIDER)).data

export const getAuthCustomer = async <T extends { orders: B; count: number }, B>(
    limit?: number,
    offset?: number,
    statuses?: string[],
) => {
    return (
        await http.get<T>(ApiEndpoints.AUTH_CUSTOMER, {
            params: {
                limit,
                offset,
                statuses,
            },
        })
    ).data
}

export const getPagePreview = async <T extends TPagePreview<B>, B>(type: string, limit?: number, offset?: number) =>
    (
        await http.get<T>(ApiEndpoints.PAGES_PREVIEW, {
            params: {
                type,
                limit,
                offset,
            },
        })
    ).data

export const getPage = async <T extends TPage<B>, B>(
    type: string,
    content_page_id?: number | string,
    restaurant_id?: number,
) =>
    (
        await http.get<T>(ApiEndpoints.PAGE_CARD, {
            params: {
                type,
                content_page_id,
                restaurant_id,
            },
        })
    ).data

export const getPromos = async (limit = 100, offset = 0) =>
    (
        await http.get(ApiEndpoints.CONTENT_PROMOS, {
            params: {
                limit,
                offset,
            },
        })
    ).data

export const getVacancies = async (limit: number, offset: number) =>
    (
        await fetch(`${process.env.NEXT_PUBLIC_HR_API_URL}/vacancy?limit=${limit}&offset=${offset}`).then((response) =>
            response.json(),
        )
    ).data

export const getSeoTitle = async (code: string) => (await http.get(ApiEndpoints.SEO_TITLES + '/' + code)).data

export const postFrontendLog = async (data: object) =>
    await http.post(ApiEndpoints.FRONTEND_LOG, {
        data,
    })
