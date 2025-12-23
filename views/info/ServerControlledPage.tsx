import React from 'react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import Image from 'next/legacy/image'
import { ParsedUrlQuery } from 'querystring'
import { observer } from 'mobx-react-lite'

import { ApiEndpoints } from '~/constants/apiEndpoints'

import { http } from '~/core/axios'

import { TPageData } from '~/types/misc'

import { TProduct } from '~/types/catalog'
import { parseRestaurantCookie } from '~/helpers'

import { RESTAURANT_COOKIE } from '~/constants/misc'
import { Layout, Section, ContentImageCarousel } from '~/components'

import HtmlContent from '~/components/HtmlContent/HtmlContent'

import styles from './ServerControlledPage.module.scss'

interface Props {
    pageData: TPageData
    recommendedProducts: TProduct[]
}

const ServerControlledPage: NextPage<Props> = observer(({ pageData, recommendedProducts }) => {
    return (
        <Layout
            description={pageData.SEO_description}
            recommendedProducts={recommendedProducts}
            title={pageData.SEO_title}
        >
            <Section title={pageData.page_name}>
                {pageData.preview_text && pageData.preview_image && (
                    <div className={styles.firstRow}>
                        <div className={styles.leftBlock}>
                            <HtmlContent content={pageData.preview_text} />
                        </div>
                        <div className={styles.imageBlock}>
                            <Image
                                alt=''
                                height='300'
                                // layout="responsive"
                                // objectFit="contain"
                                // objectPosition="top"
                                src={
                                    pageData.preview_image
                                        ? pageData.image_url
                                        : '/images/product-image-placeholder.svg'
                                }
                                unoptimized
                                width='450'
                            />
                        </div>
                    </div>
                )}
                {pageData.slider_images.length ? <ContentImageCarousel images={pageData.slider_images} /> : null}
                <HtmlContent content={pageData.content} />
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
        const [pageData] = await Promise.all([
            http.get<TPageData[]>(ApiEndpoints.PAGE, {
                params: {
                    slug: params?.slug,
                },
            }),
        ])

        if (pageData.data[0] === null) {
            return {
                notFound: true,
                recommendedProducts: recommendedProducts.data,
            }
        }

        return {
            props: {
                pageData: pageData.data[0],
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

export default ServerControlledPage
