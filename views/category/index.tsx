import React, { useCallback, useState } from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import { observer } from 'mobx-react-lite'
import { Layout, Section } from '~/components'
import { getPage } from '~/services/queries'
import { TPage } from '~/types/pages/page'
import { getRecomendedProducts, getSeoTitle } from '~/services/queries'
import { TProduct } from '~/types/catalog'
import { RESTAURANT_COOKIE } from '~/constants/misc'
import { parseRestaurantCookie, getRestaurant } from '~/helpers'
import { TCategoryPage } from '~/types/pages/category'
import { ProductDetails } from '~/views/menu/ProductDetails/ProductDetails'
import { Products } from '~/views/menu/Products/Products'
import { useSelectedProduct } from '~/views/menu/useSelectedProduct'
import Link from 'next/link'
import { useStore } from '~/hooks'
import { getMenuLink } from '~/constants/pageLinks'

interface ICategoryPage {
    content_pages: TCategoryPage
    recommendedProducts: TProduct[]
}

const Contacts: NextPage<ICategoryPage> = observer(({ recommendedProducts, content_pages: { category, products } }) => {
    const title = category?.seo_title ?? 'ИТЛЕ-СТЕЙК КАФЕ ' + category.name
    const description = category?.seo_description ?? 'ИТЛЕ-СТЕЙК КАФЕ ' + category.name
    const h1 = category.title ?? category.name
    const { orderParams } = useStore()

    const { selectedProduct, setSelectedProduct } = useSelectedProduct({
        localitySlug: `/category/${category.code}`,
        products,
    })
    const handleProductClick = useCallback(
        (product: TProduct) => {
            setSelectedProduct(product)
        },
        [setSelectedProduct],
    )

    const handleCloseDetailsModal = useCallback(() => {
        setSelectedProduct(null)
    }, [setSelectedProduct])

    return (
        <Layout title={title} description={description} recommendedProducts={recommendedProducts}>
            <div className='container'>
                <Section
                    className='menu-page d-flex flex-wrap'
                    breadcrumbs={[
                        {
                            link: '/menu',
                            title: 'Меню',
                        },
                        {
                            title: h1,
                        },
                    ]}
                >
                    <h1 className='menu-page__title section-title'>{h1}</h1>
                    <Products
                        categories={[category]}
                        onProductClick={handleProductClick}
                        products={products}
                        showCategory={() => true}
                        showTitle={false}
                    />
                    {selectedProduct !== null && (
                        <ProductDetails
                            category={category}
                            onClose={handleCloseDetailsModal}
                            product={selectedProduct}
                        />
                    )}
                    <div className='d-flex items-center justify-center menu-btn-block'>
                        <Link
                            href={getMenuLink(orderParams.restaurantId)}
                            className='about-halal__info-btn about-halal__info-btn--primary d-inline-flex items-center justify-center transition'
                        >
                            Перейти в основное меню
                        </Link>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: category.description }} />
                </Section>
            </div>
        </Layout>
    )
})

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    try {
        const cookies = ctx.req.cookies as Record<string, string>
        const code = ctx.query.code
        if (!code) {
            return {
                notFound: true,
            }
        }
        const cookieRestaurant =
            cookies[RESTAURANT_COOKIE] !== undefined ? parseRestaurantCookie(cookies[RESTAURANT_COOKIE]) : null
        const restaurant = await getRestaurant(Number(cookieRestaurant?.id))
        const recommendedProductsAwait = await getRecomendedProducts(cookies.cart_id, restaurant?.id)
        const getPageAwait = await getPage<TPage<TCategoryPage>, TCategoryPage>(
            'category',
            String(code),
            restaurant?.id,
        )
        const [page, recommendedProducts] = await Promise.all([getPageAwait, recommendedProductsAwait])

        if (!page?.content_page) {
            return {
                notFound: true,
            }
        }
        return {
            props: {
                recommendedProducts,
                content_pages: page.content_page,
            },
        }
    } catch (error: any) {
        console.error(error)
        return {
            notFound: true,
        }
    }
}

export default Contacts
