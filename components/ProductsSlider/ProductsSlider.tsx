import React, { FC, useMemo } from 'react'
import SwiperCore, { Autoplay, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { Product } from './Product'

import { TProduct } from '~/types/catalog'

import 'swiper/css'
import styles from './ProductsSlider.module.scss'

SwiperCore.use([Autoplay, Navigation])

interface Props {
    autoplay: boolean
    hideProductsWithModifiers?: boolean
    onProductClick?: (product: TProduct) => void
    products: TProduct[]
    title: string
    titleClassName?: string
}

const ProductsSlider: FC<Props> = ({
    autoplay,
    hideProductsWithModifiers,
    onProductClick,
    products,
    title,
    titleClassName
}) => {
    const handleProductClick = (product: TProduct) => () => {
        if (onProductClick !== undefined) {
            onProductClick(product)
        }
    }

    const useProducts = useMemo(() => {
        if (hideProductsWithModifiers !== null && hideProductsWithModifiers) {
            const useProducts = products.filter(product => {
                if (product.group_modifiers.length > 0) {

                    return false
                }

                return true
            })

            return useProducts
        }

        return products
    }, [ hideProductsWithModifiers, products ])

    return (
        <section className={ styles.slider }>
            <div className="container">
                <h2 className={ titleClassName ? titleClassName : styles.title }>{ title }</h2>
            </div>

            <div className={ styles.products }>
                <Swiper
                    autoHeight
                    autoplay={ autoplay ? {
                        delay: 2500,
                    } : false }
                    centeredSlides={ false }
                    className={ styles.swiperContainer }
                    loop
                    loopedSlides={ 6 }
                    slidesPerView="auto"
                    spaceBetween={ 10 }
                    watchSlidesProgress
                >
                    {
                        useProducts.map(product => (
                            <SwiperSlide key={ product.id }>
                                <Product
                                    onClick={ handleProductClick(product) }
                                    product={ product }
                                />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>
        </section>
    )
}

export { ProductsSlider }
