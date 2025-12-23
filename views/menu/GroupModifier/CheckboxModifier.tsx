import { FC, useCallback, useMemo } from 'react'
import { Checkbox } from '~/components'
import { toggleArrayElement } from '~/helpers'
import { TModifierGroup } from '~/types/catalog'
import { TSimpleOrderItemModifierWithGroup } from '~/types/cart'
import styles from './CheckboxModifier.module.scss'

interface Props {
    modifierGroup: TModifierGroup
    notSelectedRequiredModifiers: TModifierGroup[]
    onChange: (selectedModifiers: TSimpleOrderItemModifierWithGroup[]) => void
    selectedModifiers: TSimpleOrderItemModifierWithGroup[]
}

const CheckboxModifier: FC<Props> = ({ modifierGroup, onChange, selectedModifiers, notSelectedRequiredModifiers }) => {
    const toggleModifier = useCallback(
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
            const state = toggleArrayElement(
                selectedModifiers,
                {
                    id: modifierId,
                    group_id: modifierGroup,
                    amount: 1,
                    weight: modifierWeight,
                    energy_amount: energy_amount,
                    protein_amount: protein_amount,
                    fat_amount: fat_amount,
                    carbohydrate_amount: carbohydrate_amount,
                    fiber_amount: fiber_amount,
                    name: name,
                },
                (element1, element2) => element1.id === element2.id,
            )

            onChange(state)
        },
        [onChange, selectedModifiers],
    )
    const errored = useMemo(() => {
        const found = notSelectedRequiredModifiers.filter((modifier) => modifierGroup.id == modifier.id)
        return Boolean(found.length)
    }, [modifierGroup, notSelectedRequiredModifiers])

    const selectedModifierIds = useMemo(() => selectedModifiers.map((modifier) => modifier.id), [selectedModifiers])

    const modifiersSorted = useMemo(() => {
        return [...modifierGroup.modifiers].sort((a, b) => {
            return a.order - b.order
        })
    }, [modifierGroup.modifiers])

    const ruleText = useMemo(() => {
        const { min_amount, max_amount } = modifierGroup
        const conunt = modifierGroup.modifiers.length
        if (min_amount === 0 && max_amount >= conunt) return
        if (min_amount === max_amount) {
            return `(Выберите ${max_amount})`
        }

        if (min_amount && min_amount < max_amount) {
            return `(Выберите от ${min_amount} до ${max_amount})`
        }

        if (min_amount && (!max_amount || max_amount >= conunt)) {
            return `(Выберите от ${min_amount})`
        }

        if (max_amount && !min_amount && max_amount < conunt) {
            return `(Выберите  до ${max_amount})`
        }

        return null
    }, [modifierGroup])

    return (
        <div className='modifiers d-flex flex-wrap'>
            {modifierGroup.modifiers.length ? (
                <div className='modifiers-block d-flex flex-wrap' id={'modifier_' + modifierGroup.id}>
                    <div className='modifiers-block__title'>
                        {modifierGroup.name == null ? 'Дополнительно' : modifierGroup.name} <br />
                        {ruleText}
                    </div>
                    {errored && <div className={styles.errorText}>Пожалуйста, выберите подходящие варианты</div>}
                    <div className='modifiers-list d-flex flex-wrap justify-between'>
                        {modifiersSorted.map((modifier) => (
                            <div key={modifier.id} className='modifiers-list__item d-flex items-center justify-between'>
                                <div className='modifiers-list__item-checkbox'>
                                    <Checkbox
                                        checked={selectedModifierIds.includes(modifier.id)}
                                        label={modifier.name}
                                        onChange={() =>
                                            toggleModifier(
                                                modifier.id,
                                                modifier.weight,
                                                modifierGroup.id,
                                                modifier.energy_amount,
                                                modifier.protein_amount,
                                                modifier.fat_amount,
                                                modifier.carbohydrate_amount,
                                                modifier.fiber_amount,
                                                modifier.name,
                                                // modifier.pivot,
                                            )
                                        }
                                    />
                                </div>
                                {modifier.price > 0 && (
                                    <div className='modifiers-list__item-price d-flex'>{modifier.price} ₽</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                false
            )}
        </div>
    )
}

export { CheckboxModifier }
