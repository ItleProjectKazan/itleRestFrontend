import { FC, useMemo } from 'react'

import { getDefaultSelectedModifiers } from '~/helpers/product'
import { useProductPrice } from '~/hooks/product'
import { rawImageLoader } from '~/services/rawImageLoader'

import { ImageWithFallback } from '~/components'

import { TProduct } from '~/types/catalog'

import styles from './Product.module.scss'

interface Props {
    onClick?: () => void
    product: TProduct
}

const Product: FC<Props> = ({
    onClick,
    product,
}) => {
    const modifiers = useMemo(() => (
        getDefaultSelectedModifiers(product)
    ), [product])
    const price = useProductPrice(product, modifiers)

    return (
        <div className={ styles.product } onClick={ onClick }>
            <div className={ styles.image }>
                <ImageWithFallback
                    alt={ product.name }
                    fallbackSrc={ product.image_url !== null ? product.image_url + '.jpg' : '/images/product-image-placeholder.svg' }
                    layout="fill"
                    loader={ rawImageLoader }
                    objectFit="contain"
                    src={ product.image_url !== null ? product.image_url + '.webp' : '/images/product-image-placeholder.svg' }
                    unoptimized
                />
            </div>
            <div className={ styles.info }>
                <span className={ styles.name }>{ product.name }</span>
                <div className={ styles.price }>{ price } ₽</div>
            </div>
        </div>
    )
}

export { Product }
