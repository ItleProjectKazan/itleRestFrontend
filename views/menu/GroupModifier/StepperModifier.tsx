import { FC, useCallback, useMemo } from 'react'
import classNames from 'classnames'

import { TModifierGroup } from '~/types/catalog'
import { TSimpleOrderItemModifierWithGroup } from '~/types/cart'

import styles from './StepperModifier.module.scss'

interface Props {
    border: boolean
    modifierGroup: TModifierGroup
    onChange: (selectedModifiers: TSimpleOrderItemModifierWithGroup[]) => void
    selectedModifiers: TSimpleOrderItemModifierWithGroup[]
}

const StepperModifier: FC<Props> = ({ border, modifierGroup, onChange, selectedModifiers }) => {
    const handleChange = useCallback(
        (
            modifierId: number,
            modifierWeight: number,
            modifierGroup: number,
            energy_amount: number,
            protein_amount: number,
            fat_amount: number,
            carbohydrate_amount: number,
            fiber_amount: number,
            name: string,
        ) => {
            onChange([
                {
                    id: modifierId,
                    amount: 1,
                    group_id: modifierGroup,
                    weight: modifierWeight,
                    energy_amount: energy_amount,
                    protein_amount: protein_amount,
                    fat_amount: fat_amount,
                    carbohydrate_amount: carbohydrate_amount,
                    fiber_amount: fiber_amount,
                    name: name,
                },
            ])
        },
        [onChange],
    )

    const selectedModifierIds = useMemo(() => {
        return selectedModifiers.map((modifier) => modifier.id)
    }, [selectedModifiers])

    return (
        <div
            key={modifierGroup.id}
            className={classNames(styles.stepper, {
                [styles.stepperContained]: !border,
                [styles.stepperOutlined]: border,
            })}
        >
            {modifierGroup.modifiers.map((modifier) => (
                <div
                    key={modifier.id}
                    className={classNames(styles.option, {
                        [styles.optionNotSelected]: !selectedModifierIds.includes(modifier.id),
                        [styles.optionSelected]: selectedModifierIds.includes(modifier.id),
                    })}
                    onClick={() =>
                        handleChange(
                            modifier.id,
                            modifier.weight,
                            modifierGroup.id,
                            modifier.energy_amount,
                            modifier.protein_amount,
                            modifier.fat_amount,
                            modifier.carbohydrate_amount,
                            modifier.fiber_amount,
                            modifier.name,
                        )
                    }
                >
                    {modifier.name}
                </div>
            ))}
        </div>
    )
}

export { StepperModifier }
