import { useMemo } from 'react'

import { TProduct } from '~/types/catalog'
import { TOrderItemModifier } from '~/types/cart'

export const useProductFoodValues = (product: TProduct, modifiers: TOrderItemModifier[]) => {
    return useMemo(() => {
        let energy_amount = product.energy_amount
        let protein_amount = product.protein_amount
        let fat_amount = product.fat_amount
        let carbohydrate_amount = product.carbohydrate_amount
        let fiber_amount = product.fiber_amount

        if (modifiers.length) {
            modifiers.map((modifier) => {
                if (modifier.energy_amount > 0) {
                    energy_amount += modifier.energy_amount
                }
                if (modifier.protein_amount > 0) {
                    protein_amount += modifier.protein_amount
                }
                if (modifier.fat_amount > 0) {
                    fat_amount += modifier.fat_amount
                }
                if (modifier.carbohydrate_amount > 0) {
                    carbohydrate_amount += modifier.carbohydrate_amount
                }
                if (modifier.fiber_amount > 0) {
                    fiber_amount += modifier.fiber_amount
                }
            })
        }

        return {
            energy_amount: energy_amount,
            protein_amount: protein_amount,
            fat_amount: fat_amount,
            carbohydrate_amount: carbohydrate_amount,
            fiber_amount: fiber_amount,
        }
    }, [product, modifiers])
}
