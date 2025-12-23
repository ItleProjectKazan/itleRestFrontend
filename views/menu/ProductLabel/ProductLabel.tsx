import React, { FC } from 'react'

import classNames from 'classnames'

import { TProduct } from '~/types/catalog'

import styles from './ProductLabel.module.scss'

interface Props {
    className?: string
    product: TProduct
}

const ProductLabel: FC<Props> = ({
    className,
    product,
}) => {
    return (
        <div className={ className }>
            {
                product.discount !== null &&
                <span className={ classNames( styles.label, styles.discount ) } >скидка</span>

            }
            {
                product.is_new &&
                product.discount === null &&
                <span className={ classNames( styles.label, styles.hit ) } >хит</span>
            }
        </div>
    )
}

export { ProductLabel }
