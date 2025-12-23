import { TModifierControlType, TModifierGroup, TProduct } from '~/types/catalog'
import { TOrderItemModifier } from '~/types/cart'

const valueRequiredControls = [
    TModifierControlType.STEPPER,
    TModifierControlType.STEPPER_OUTLINED,
    TModifierControlType.SELECT,
]

const isValueRequired = (modifierGroup: TModifierGroup) => {
    const controlType = modifierGroup.control_type ?? TModifierControlType.STEPPER_OUTLINED

    return valueRequiredControls.includes(controlType)
}

export const getDefaultSelectedModifiers = (product: TProduct) => {
    const selectedModifiers = [] as TOrderItemModifier[]

    product.group_modifiers.map((modifierGroup) => {
        if (isValueRequired(modifierGroup)) {
            if (modifierGroup.modifiers[0] !== undefined) {
                selectedModifiers.push({
                    id: modifierGroup.modifiers[0].id,
                    group_id: modifierGroup.id,
                    name: modifierGroup.name || '',
                    amount: 1,
                    weight: modifierGroup.modifiers[0].weight,
                    energy_amount: modifierGroup.modifiers[0].energy_amount,
                    protein_amount: modifierGroup.modifiers[0].protein_amount,
                    fat_amount: modifierGroup.modifiers[0].fat_amount,
                    carbohydrate_amount: modifierGroup.modifiers[0].carbohydrate_amount,
                    fiber_amount: modifierGroup.modifiers[0].fiber_amount,
                })
            }
        }
    })

    product.modifiers.map((modifier) => {
        if (modifier.min_amount > 0) {
            selectedModifiers.push({
                id: modifier.id,
                group_id: null,
                amount: 1,
                name: modifier.name,
                weight: modifier.weight,
                energy_amount: modifier.energy_amount,
                protein_amount: modifier.protein_amount,
                fat_amount: modifier.fat_amount,
                carbohydrate_amount: modifier.carbohydrate_amount,
                fiber_amount: modifier.fiber_amount,
            })
        }
    })

    return selectedModifiers
}
