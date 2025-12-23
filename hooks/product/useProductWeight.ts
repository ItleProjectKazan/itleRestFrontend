import { useMemo } from 'react'

import { TProduct } from '~/types/catalog'
import { TOrderItemModifier } from '~/types/cart'

export const useProductWeight = (product: TProduct, modifiers: TOrderItemModifier[]) => {
    return useMemo(() => {
        let weight = product.weight

        if (modifiers.length) {
            modifiers.map( (modifier) => {
                if (modifier.weight > 0) {
                    weight += modifier.weight
                }
            })
        }

        return weight
    }, [product, modifiers])
}
