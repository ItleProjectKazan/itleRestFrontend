import { FC, useEffect, useMemo } from 'react'
import { groupBy } from 'lodash'
import useScrollSpy from 'react-use-scrollspy'
import { CatalogSection } from '../CatalogSection/CatalogSection'
import { Loader } from '~/components'
import { TCategory, TProduct } from '~/types/catalog'
import styles from './Products.module.scss'

interface Props {
    categories: TCategory[]
    onActiveCategoryChange?: (categoryCode: string | null) => void
    onProductClick: (product: TProduct) => void
    products: TProduct[]
    showCategory: (category: TCategory) => boolean
    showTitle?: boolean
}

const Products: FC<Props> = ({
    categories,
    onActiveCategoryChange,
    onProductClick,
    products,
    showCategory,
    showTitle = true,
}) => {
    const sectionRefs = categories?.map(() => {
        return { current: null }
    })

    const activeSectionIndex = useScrollSpy({
        sectionElementRefs: sectionRefs,
        offsetPx: -230,
    })

    useEffect(() => {
        if (activeSectionIndex === undefined) return
        if (onActiveCategoryChange) {
            onActiveCategoryChange(categories[activeSectionIndex]?.code ?? null)
        }
    }, [activeSectionIndex, categories, onActiveCategoryChange])

    const productsByCategory = useMemo(() => {
        return groupBy(products, 'category_id')
    }, [products])
    if (!categories?.length) {
        return (
            <div className={styles.loaderHolder}>
                <Loader />
            </div>
        )
    }

    return (
        <div className='categories-list'>
            {categories.map((category, index) => {
                if (!showCategory(category)) {
                    return null
                }
                return (
                    <CatalogSection
                        key={category.id}
                        ref={sectionRefs[index]}
                        category={category}
                        onProductClick={onProductClick}
                        products={productsByCategory[category.id] ?? []}
                        showTitle={showTitle}
                    />
                )
            })}
        </div>
    )
}

export { Products }
