import React, { useMemo } from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import { observer } from 'mobx-react-lite'
import { getRestaurant } from '~/helpers'
import { getBanners, getRecomendedProducts, getSeoTitle } from '~/services/queries'
import { Layout } from '~/components'
import Banner from './Banner'
import BannerMobile from './BannerMobile'
import Advantages from './Advantages'
import AtmosphereComfort from './AtmosphereComfort'
import CategoriesSlider from './CategoriesSlider'
import AboutHalal from './AboutHalal'
import NewsSlider from '~/components/NewsSlider'
import { TBanner, TSeoTitle, TBannerType } from '~/types/misc'
import { TProduct } from '~/types/catalog'

interface IHome {
    banners: TBanner[]
    recommendedProducts: TProduct[]
    seoTitles: TSeoTitle
}

const Home: NextPage<IHome> = observer(({ banners, recommendedProducts, seoTitles }) => {
    const title = seoTitles?.seo_title || 'ИТЛЕ-СТЕЙК КАФЕ | Казань'
    const description = seoTitles?.seo_description || 'ИТЛЕ-СТЕЙК КАФЕ | Казань'

    const desktopBanners = useMemo(() => banners.filter((banner) => banner.type === TBannerType.DESKTOP), [banners])

    const mobileBanners = useMemo(() => banners.filter((banner) => banner.type === TBannerType.MOBILE), [banners])

    return (
        <Layout title={title} description={description} recommendedProducts={recommendedProducts} isHomePage={true}>
            {desktopBanners.length > 0 && <Banner banners={desktopBanners} />}
            {mobileBanners.length > 0 && <BannerMobile banners={mobileBanners} />}
            <Advantages />
            <AtmosphereComfort />
            <CategoriesSlider />
            <AboutHalal />
            <NewsSlider />
        </Layout>
    )
})

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const cookies = ctx.req.cookies as Record<string, string>
    const restaurant = await getRestaurant()
    if (!restaurant) {
        return {
            notFound: true,
        }
    }
    const bannersAwait = getBanners(restaurant?.id)
    const recommendedProductsAwait = getRecomendedProducts(cookies.cart_id, restaurant?.id)
    const getSeoTitleAwait = getSeoTitle('index')
    const [banners, recommendedProducts, seoTitles] = await Promise.all([
        bannersAwait,
        recommendedProductsAwait,
        getSeoTitleAwait,
    ])

    return {
        props: {
            restaurantId: restaurant.id,
            banners,
            recommendedProducts,
            seoTitles,
        },
    }
}

export default Home
