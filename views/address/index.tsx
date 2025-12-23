import React from 'react'
import { Layout, Section } from '~/components'
import { useStore } from '~/hooks'
import { GetServerSideProps, NextPage } from 'next'
import { getRecomendedProducts } from '~/services/queries'
import RestorauntShedule from '~/components/RestorauntShedule'
import NewsSlider from '~/components/NewsSlider'
import { RESTAURANT_COOKIE } from '~/constants/misc'
import { parseRestaurantCookie, getRestaurant } from '~/helpers'
import { TProduct } from '~/types/catalog'
import PromoList from '~/components/PromoList'
interface IAddress {
    recommendedProducts: TProduct[]
}

const Address: NextPage<IAddress> = ({ recommendedProducts }: IAddress) => {
    const { localities } = useStore()

    return (
        <Layout description='наши стейк-кафе' title='наши стейк-кафе' recommendedProducts={recommendedProducts}>
            <Section className='address-page d-flex flex-wrap' title='наши стейк-кафе'>
                <div className='container'>
                    <h1 className='address-page__title section-title'>
                        <span>наши</span> стейк-кафе
                    </h1>

                    {localities?.length && localities[0].restaurants?.length > 0
                        ? localities[0].restaurants?.map(({ id }) => (
                              <RestorauntShedule key={id} restaurantId={id} withBooking />
                          ))
                        : null}

                    {/* <PromoList limit={2} /> */}
                </div>
            </Section>
            <NewsSlider />
        </Layout>
    )
}
export default Address
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const cookies = ctx.req.cookies as Record<string, string>
    const cookieRestaurant =
        cookies[RESTAURANT_COOKIE] !== undefined ? parseRestaurantCookie(cookies[RESTAURANT_COOKIE]) : null
    const restaurant = await getRestaurant(Number(cookieRestaurant?.id))
    const recommendedProducts = await getRecomendedProducts(cookies?.cart_id, restaurant?.id)

    return {
        props: {
            recommendedProducts,
        },
    }
}
