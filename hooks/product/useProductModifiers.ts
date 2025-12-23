import { useCallback, useMemo, useState } from 'react'
import { groupBy } from 'lodash'

import { getDefaultSelectedModifiers } from '~/helpers/product'

import { TProduct } from '~/types/catalog'
import { TSimpleOrderItemModifier, TOrderItemModifier } from '~/types/cart'

import { SIMPLE_MODIFIER_GROUP_KEY } from '~/constants/misc'

export const useProductModifiers = (product: TProduct) => {
    const [selectedModifiers, setSelectedModifiers] = useState<TOrderItemModifier[]>(() => {
        return getDefaultSelectedModifiers(product)
    })

    const handleModifierChange = useCallback((groupId: number | null) => {
        return (modifiers: TSimpleOrderItemModifier[]) => {
            setSelectedModifiers((value) => {
                return [
                    ...value.filter((modifier) => modifier.group_id !== groupId),
                    ...modifiers.map((modifier) => ({
                        id: modifier.id,
                        group_id: groupId,
                        amount: modifier.amount,
                        name: modifier.name,
                        weight: modifier.weight,
                        energy_amount: modifier.energy_amount,
                        protein_amount: modifier.protein_amount,
                        fat_amount: modifier.fat_amount,
                        carbohydrate_amount: modifier.carbohydrate_amount,
                        fiber_amount: modifier.fiber_amount,
                    })),
                ]
            })
        }
    }, [])

    const selectedModifiersMap = useMemo(
        () => groupBy(selectedModifiers, (modifier) => modifier.group_id ?? SIMPLE_MODIFIER_GROUP_KEY),
        [selectedModifiers],
    )

    return {
        handleModifierChange,
        selectedModifiers,
        selectedModifiersMap,
    }
}
