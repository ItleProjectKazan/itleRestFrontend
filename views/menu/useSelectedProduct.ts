import { useEffect, useState } from 'react'
// import Router from 'next/router'
import { useRouter } from 'next/router'
import { usePrevious } from '~/hooks'
import { TProduct } from '~/types/catalog'
import { getMenuLink } from '~/constants/pageLinks'
import { useStore } from '~/hooks'

export const useSelectedProduct = ({
    localitySlug,
    products,
}: {
    localitySlug: string | null
    products: TProduct[]
}) => {
    const router = useRouter()
    const { orderParams } = useStore()
    const productId = router.query.product_id !== undefined ? parseInt(router.query.product_id as string) : null

    const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(() => {
        if (productId === null) {
            return null
        }

        return products.find((product) => product.id === productId) ?? null
    })
    const prevSelectedProduct = usePrevious(selectedProduct)

    useEffect(() => {
        // const localityPath = getMenuLink(orderParams.restaurantId)
        // const localityPath = `/${router.query.localitySlug}`
        const localityPath = `/${localitySlug}`

        // if a modal was closed
        if (selectedProduct === null && prevSelectedProduct !== null) {
            router.push(
                {
                    pathname: localityPath,
                },
                undefined,
                { scroll: false },
            )
        }

        // specify product ID in query string if it's selected
        if (selectedProduct !== null && productId !== selectedProduct.id) {
            router.push(
                {
                    pathname: localityPath,
                    query: {
                        product_id: selectedProduct.id,
                    },
                },
                undefined,
                { scroll: false },
            )
        }
    }, [localitySlug, prevSelectedProduct, productId, products, router, selectedProduct])

    return {
        selectedProduct,
        setSelectedProduct,
    }
}
