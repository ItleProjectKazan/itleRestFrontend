import React from 'react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { Layout, Section } from '~/components'
import { getRecomendedProducts, getSeoTitle } from '~/services/queries'
import { TProduct } from '~/types/catalog'
import { RESTAURANT_COOKIE } from '~/constants/misc'
import { TSeoTitle } from '~/types/misc'
import { parseRestaurantCookie, getRestaurant } from '~/helpers'

// import PromoList from '~/components/PromoList'
import NewsList from './NewsList'

interface IEvents {
    recommendedProducts: TProduct[]
    seoTitles: TSeoTitle
}

const Events: NextPage<IEvents> = ({ recommendedProducts, seoTitles }: IEvents) => {
    const title = seoTitles?.seo_title || 'ИТЛЕ-СТЕЙК КАФЕ | Новости| События'
    const description = seoTitles?.seo_description || 'ИТЛЕ-СТЕЙК КАФЕ | Новости | События'

    return (
        <Layout description={description} title={title} recommendedProducts={recommendedProducts}>
            <Section className='events-page d-flex flex-wrap' title='События'>
                <div className='container d-flex flex-wrap'>
                    <h1 className='interior-page__title section-title'>События</h1>
                    <div className='section-page' style={{ marginTop: 0 }}>
                        <NewsList />
                    </div>
                    {/* <div className="section-page" style={{marginBottom: 0}}>
                        <PromoList />
                    </div> */}
                </div>
            </Section>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    try {
        const cookies = ctx.req.cookies as Record<string, string>
        const cookieRestaurant =
            cookies[RESTAURANT_COOKIE] !== undefined ? parseRestaurantCookie(cookies[RESTAURANT_COOKIE]) : null
        const restaurant = await getRestaurant(Number(cookieRestaurant?.id))

        const recommendedProductsAwait = getRecomendedProducts(cookies?.cart_id, restaurant?.id)
        const getSeoTitleAwait = getSeoTitle('events')
        const [recommendedProducts, seoTitles] = await Promise.all([recommendedProductsAwait, getSeoTitleAwait])

        return {
            props: {
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

export default Events
