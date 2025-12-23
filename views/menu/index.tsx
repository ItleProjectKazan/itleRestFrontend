import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { Layout, Section } from '~/components'
import { observer } from 'mobx-react-lite'
import type { GetServerSideProps, NextPage } from 'next'
import { findRestaurant, getRestaurant, parseRestaurantCookie } from '~/helpers'
import { groupBy, keyBy } from 'lodash'
import { TCategory, TProduct } from '~/types/catalog'
import { Products } from './Products/Products'
import { getCategories, getProducts, getRecomendedProducts, getSeoTitle } from '~/services/queries'
import { useSelectedProduct } from './useSelectedProduct'
import { ProductDetails } from './ProductDetails/ProductDetails'
import { Categories } from './Categories/Categories'
import NewsSlider from '~/components/NewsSlider'
import { RESTAURANT_COOKIE } from '~/constants/misc'
import { useRouter } from 'next/router'
import { TSeoTitle } from '~/types/misc'
// import PromoList from '~/components/PromoList'
import { getMenuLink } from '~/constants/pageLinks'
import { useStore } from '~/hooks'

interface IMenu {
    localitySlug: string | null
    categories: TCategory[]
    products: TProduct[]
    recommendedProducts: TProduct[]
    seoTitles: TSeoTitle
}

const Menu: NextPage<IMenu> = observer(
    ({ categories, products, localitySlug, recommendedProducts = [], seoTitles }: IMenu) => {
        const title = seoTitles?.seo_title || 'ИТЛЕ-СТЕЙК КАФЕ | Меню'
        const description =
            seoTitles?.seo_description ||
            'Доставка еды в Казани - Halal бургеры, стейки - заказать на дом или в офис | ИТLЕ'
        const { orderParams } = useStore()

        const router = useRouter()
        const [activeCategoryCode, setActiveCategoryCode] = useState<string | null>(null)
        const { selectedProduct, setSelectedProduct } = useSelectedProduct({
            localitySlug: getMenuLink(orderParams.restaurantId),
            products,
        })

        useEffect(() => {
            setActiveCategoryCode(null)
        }, [router.asPath])

        const handleProductClick = useCallback(
            (product: TProduct) => {
                setSelectedProduct(product)
            },
            [setSelectedProduct],
        )
        const productsByCategory = useMemo(() => {
            return groupBy(products, 'category_id')
        }, [products])

        const showCategory = useCallback(
            (category: TCategory) => {
                if (productsByCategory[category.id] === undefined) {
                    return false
                }

                return true
            },
            [productsByCategory],
        )

        const categoriesById = useMemo(() => {
            return keyBy(categories, 'id')
        }, [categories])

        const handleCloseDetailsModal = useCallback(() => {
            setSelectedProduct(null)
        }, [setSelectedProduct])

        return (
            <Layout title={title} description={description} recommendedProducts={recommendedProducts}>
                <div className='container'>
                    <Section className='menu-page d-flex flex-wrap' title='меню'>
                        <h1 className='menu-page__title section-title'>
                            <span>наше</span> меню
                        </h1>
                        <Categories
                            activeCategoryCode={activeCategoryCode}
                            categories={categories}
                            showCategory={showCategory}
                        />
                        <Products
                            onActiveCategoryChange={setActiveCategoryCode}
                            categories={categories}
                            onProductClick={handleProductClick}
                            products={products}
                            showCategory={showCategory}
                        />
                        {selectedProduct !== null && (
                            <ProductDetails
                                category={categoriesById[selectedProduct.category_id]}
                                onClose={handleCloseDetailsModal}
                                product={selectedProduct}
                            />
                        )}
                    </Section>
                    {/* <PromoList limit={2} /> */}
                </div>
                <NewsSlider />
            </Layout>
        )
    },
)

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    try {
        const id = ctx.query.id
        const cookies = ctx.req.cookies as Record<string, string>
        const cookieRestaurant =
            cookies[RESTAURANT_COOKIE] !== undefined ? parseRestaurantCookie(cookies[RESTAURANT_COOKIE]) : null

        let restaurant = await findRestaurant(Number(id) || Number(cookieRestaurant?.id))

        if (!restaurant) {
            restaurant = await getRestaurant(Number(id))
        }

        if (id && !restaurant) {
            return {
                notFound: true,
            }
        }
        const cartId = cookies?.cart_id
        const categoriesAwait = getCategories(restaurant?.id)
        const productsAwait = getProducts(restaurant?.id)
        const seoTitleAwait = getSeoTitle('menu')
        const recommendedProductsAwait = getRecomendedProducts(cartId, restaurant?.id)

        const [categories, products, recommendedProducts, seoTitles] = await Promise.all([
            categoriesAwait,
            productsAwait,
            recommendedProductsAwait,
            seoTitleAwait,
        ])

        return {
            props: {
                restaurantId: restaurant?.id,
                categories,
                products,
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

export default Menu
