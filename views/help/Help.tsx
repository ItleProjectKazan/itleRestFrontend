import React from 'react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { observer } from 'mobx-react-lite'

import { ApiEndpoints } from '~/constants/apiEndpoints'

import { http } from '~/core/axios'

import { TPromo } from '~/types/misc'
import { TProduct } from '~/types/catalog'
import { parseRestaurantCookie } from '~/helpers'

import { RESTAURANT_COOKIE } from '~/constants/misc'

import { Layout, Section } from '~/components'

import styles from './Help.module.scss'

interface Props {
    promos: TPromo[]
    recommendedProducts: TProduct[]
}

const Help: NextPage<Props> = observer(({
    promos,
    recommendedProducts,
}) => {
    return (
        <Layout
            description="Помощь"
            recommendedProducts={recommendedProducts}
            title="Помощь"
        >
            <Section title="Помощь">
                <div className={styles.holder}>
                    Если у вас возникли проблемы при оформлении заказа или появился вопрос уточните по телефону +7(843)2023320 (добавочный 4), у наших операторов.
                </div>
            </Section>
        </Layout>
    )
})

interface QueryParams extends ParsedUrlQuery {
    slug?: string
}

export const getServerSideProps: GetServerSideProps<Props, QueryParams> = async (ctx) => {
    const cookies = ctx.req.cookies as Record<string, string>
    const restaurant = cookies[RESTAURANT_COOKIE] !== undefined ? parseRestaurantCookie(cookies[RESTAURANT_COOKIE]) : null

    const [recommendedProducts] = await Promise.all([
        http.get<TProduct[]>(ApiEndpoints.CART_RECOMMENDED_PRODUCTS, {
            params: {
                cart_id: cookies.cart_id,
                restaurant_id: restaurant?.id,
            },
        }),
    ])

    try {
        const [promos] = await Promise.all([
            http.get<TPromo[][]>(ApiEndpoints.PROMOS_LIST, {
                params: {
                    content_type: 'promos',
                },
            }),
        ])

        return {
            props: {
                promos: promos.data[0],
                recommendedProducts: recommendedProducts.data,
            },
        }
    } catch (error: any) {
        return {
            notFound: true,
            recommendedProducts: recommendedProducts.data,
        }
    }
}

export default Help
