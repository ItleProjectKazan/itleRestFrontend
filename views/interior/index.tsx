import React from 'react'
import { NextPage, GetServerSideProps } from 'next'
import { getRecomendedProducts, getSeoTitle } from '~/services/queries'
import { Layout, Section } from '~/components'
import NewsSlider from '~/components/NewsSlider'
import EstablishmentList from './EstablishmentList'
import { TProduct } from '~/types/catalog'
import { RESTAURANT_COOKIE } from '~/constants/misc'
import { parseRestaurantCookie, getRestaurant } from '~/helpers'
import { TSeoTitle } from '~/types/misc'

interface IInterior {
    recommendedProducts: TProduct[]
    seoTitles: TSeoTitle
}

const Interior: NextPage<IInterior> = ({ recommendedProducts = [], seoTitles }: IInterior) => {
    const title = seoTitles?.seo_title || 'ИТЛЕ-СТЕЙК КАФЕ | Локации'
    const description = seoTitles?.seo_description || 'ИТЛЕ-СТЕЙК КАФЕ | Локации'

    return (
        <Layout description={description} title={title} recommendedProducts={recommendedProducts}>
            <>
                <Section className='interior-page d-flex flex-wrap' title='локации'>
                    <div className='container'>
                        <h1 className='interior-page__title section-title'>
                            ИTLE — <span>это атмосфера</span>
                            <br />
                            безопасности, спокойствия, теплого семейного очага и уюта
                        </h1>

                        <div className='interior-page__text'>
                            <p>Локации:</p>
                        </div>

                        <EstablishmentList />
                    </div>
                </Section>
                <NewsSlider />
            </>
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
        const getSeoTitleAwait = getSeoTitle('interior')
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

export default Interior
