import { useMemo } from 'react'

import { calculateProductPrice } from '~/helpers/product'

import { TProduct } from '~/types/catalog'
import { TOrderItemModifier } from '~/types/cart'

export const useProductPrice = (product: TProduct, modifiers: TOrderItemModifier[]) => {
    return useMemo(() => {
        return calculateProductPrice(product, modifiers)
    }, [product, modifiers])
}
