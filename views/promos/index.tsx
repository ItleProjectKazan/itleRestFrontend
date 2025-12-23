import React from 'react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { observer } from 'mobx-react-lite'
import { TProduct } from '~/types/catalog'
import { RESTAURANT_COOKIE } from '~/constants/misc'
import { Layout, Section } from '~/components'
import PromoList from '~/components/PromoList'
import { parseRestaurantCookie, getRestaurant } from '~/helpers'
import { getRecomendedProducts, getSeoTitle } from '~/services/queries'
import { TSeoTitle } from '~/types/misc'

interface Props {
    recommendedProducts: TProduct[]
    seoTitles: TSeoTitle
}

const ServerControlledPage: NextPage<Props> = observer(({ recommendedProducts, seoTitles }) => {
    const title = seoTitles?.seo_title || 'ИТЛЕ-СТЕЙК КАФЕ | Акции'
    const description = seoTitles?.seo_description || 'ИТЛЕ-СТЕЙК КАФЕ | Акции'

    return (
        <Layout title={title} description={description} recommendedProducts={recommendedProducts}>
            <Section className='promotions-page' title='Акции и скидки'>
                <h1 className='menu-page__title section-title'>
                    <span>акции</span> и скидки
                </h1>
                <PromoList />
            </Section>
        </Layout>
    )
})

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    try {
        const cookies = ctx.req.cookies as Record<string, string>

        const cookieRestaurant =
            cookies[RESTAURANT_COOKIE] !== undefined ? parseRestaurantCookie(cookies[RESTAURANT_COOKIE]) : null
        const restaurant = await getRestaurant(Number(cookieRestaurant?.id))
        const recommendedProductsAwait = getRecomendedProducts(cookies?.cart_id, restaurant?.id)
        const getSeoTitleAwait = getSeoTitle('promos')
        const [recommendedProducts, seoTitles] = await Promise.all([recommendedProductsAwait, getSeoTitleAwait])

        return {
            props: {
                // promos: promos.data,
                recommendedProducts,
                seoTitles,
            },
        }
    } catch (error: any) {
        console.error(error)
        return {
            notFound: true,
        }
    }
}

export default ServerControlledPage
