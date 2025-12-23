import React from 'react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { observer } from 'mobx-react-lite'

import Image from 'next/legacy/image'
import Link from 'next/link'

import { ApiEndpoints } from '~/constants/apiEndpoints'

import { http } from '~/core/axios'

import { TPromo } from '~/types/misc'
import { TProduct } from '~/types/catalog'
import { parseRestaurantCookie } from '~/helpers'

import { RESTAURANT_COOKIE } from '~/constants/misc'

import { Button, ContentImageCarousel, Layout, Section } from '~/components'

import HtmlContent from '~/components/HtmlContent/HtmlContent'

import styles from './SinglePromo.module.scss'

interface Props {
    promo: TPromo
    recommendedProducts: TProduct[]
}

const SinglePromo: NextPage<Props> = observer(({ promo, recommendedProducts }) => {
    return (
        <Layout description={promo.SEO_description} recommendedProducts={recommendedProducts} title={promo.SEO_title}>
            <Section>
                <Link href='/promos' className={styles.returnToList}>
                    ← Все акции
                </Link>
                {promo.preview_image !== null ||
                    (promo.image_url !== null && (
                        <div className={styles.promoImage}>
                            <Image
                                alt=''
                                height='180'
                                layout='responsive'
                                objectFit='contain'
                                objectPosition='top'
                                src={promo.preview_image ? promo.image_url : '/images/product-image-placeholder.svg'}
                                unoptimized
                                width='560'
                            />
                        </div>
                    ))}
                <h1 className={styles.title}>{promo.page_name}</h1>
                {promo.slider_images.length ? <ContentImageCarousel images={promo.slider_images} /> : null}
                <HtmlContent content={promo.content} />
                {promo.button && promo.button_link && promo.button.length && promo.button_link.length && (
                    <div className={styles.toMenuButtonHolder}>
                        <Button className={styles.toMenuButton} href={promo.button_link}>
                            {promo.button}
                        </Button>
                    </div>
                )}
            </Section>
        </Layout>
    )
})

interface QueryParams extends ParsedUrlQuery {
    slug?: string
}

export const getServerSideProps: GetServerSideProps<Props, QueryParams> = async (ctx) => {
    const { params } = ctx

    const cookies = ctx.req.cookies as Record<string, string>
    const restaurant =
        cookies[RESTAURANT_COOKIE] !== undefined ? parseRestaurantCookie(cookies[RESTAURANT_COOKIE]) : null

    const [recommendedProducts] = await Promise.all([
        http.get<TProduct[]>(ApiEndpoints.CART_RECOMMENDED_PRODUCTS, {
            params: {
                cart_id: cookies.cart_id,
                restaurant_id: restaurant?.id,
            },
        }),
    ])

    try {
        const [promo] = await Promise.all([
            http.get<TPromo[]>(ApiEndpoints.PAGE, {
                params: {
                    slug: params?.slug,
                },
            }),
        ])

        if (promo.data[0] === null) {
            return {
                notFound: true,
                recommendedProducts: recommendedProducts.data,
            }
        }

        return {
            props: {
                promo: promo.data[0],
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

export default SinglePromo
