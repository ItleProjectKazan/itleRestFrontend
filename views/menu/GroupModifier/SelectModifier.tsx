import { FC, useCallback, useMemo } from 'react'

import { Select } from '~/components'

import { TModifierGroup } from '~/types/catalog'
import { TSimpleOrderItemModifierWithGroup } from '~/types/cart'

import styles from './SelectModifier.module.scss'

type TModifierOption = {
    group_id: number
    value: number
    label: string
    weight: number
    energy_amount: number
    protein_amount: number
    fat_amount: number
    carbohydrate_amount: number
    fiber_amount: number
}

interface Props {
    modifierGroup: TModifierGroup
    onChange: (selectedModifiers: TSimpleOrderItemModifierWithGroup[]) => void
    selectedModifiers: TSimpleOrderItemModifierWithGroup[]
}

const SelectModifier: FC<Props> = ({ modifierGroup, onChange, selectedModifiers }) => {
    const handleChange = useCallback(
        (selectedOption: TModifierOption) => {
            onChange([
                {
                    id: selectedOption.value,
                    amount: 1,
                    group_id: selectedOption.group_id,
                    weight: selectedOption.weight,
                    energy_amount: selectedOption.energy_amount,
                    protein_amount: selectedOption.protein_amount,
                    fat_amount: selectedOption.fat_amount,
                    carbohydrate_amount: selectedOption.carbohydrate_amount,
                    fiber_amount: selectedOption.fiber_amount,
                    name: selectedOption.label,
                },
            ])
        },
        [onChange],
    )

    const modifiersSorted = useMemo(() => {
        return [...modifierGroup.modifiers].sort((a, b) => {
            return a.order - b.order
        })
    }, [modifierGroup.modifiers])

    const options: TModifierOption[] = useMemo(() => {
        return modifiersSorted.map((modifier) => {
            return {
                group_id: modifierGroup.id,
                label: modifier.name,
                value: modifier.id,
                weight: modifier.weight,
                energy_amount: modifier.energy_amount,
                protein_amount: modifier.protein_amount,
                fat_amount: modifier.fat_amount,
                carbohydrate_amount: modifier.carbohydrate_amount,
                fiber_amount: modifier.fiber_amount,
            }
        })
    }, [modifiersSorted])

    const value = options.find((option) => {
        return selectedModifiers.find((modifier) => modifier.id === option.value) !== undefined
    })

    return (
        <div className='modifiers-select'>
            <Select instanceId={modifierGroup.id} onChange={handleChange as any} options={options} value={value} />
        </div>
    )
}

export { SelectModifier }
