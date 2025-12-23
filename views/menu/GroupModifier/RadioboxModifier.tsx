import { FC, useCallback, useMemo } from 'react'
import classNames from 'classnames'

import { Radiobox } from '~/components'

import { TModifierGroup } from '~/types/catalog'
import { TSimpleOrderItemModifierWithGroup } from '~/types/cart'

import styles from './CheckboxModifier.module.scss'

interface Props {
    modifierGroup: TModifierGroup
    notSelectedRequiredModifiers: TModifierGroup[]
    onChange: (selectedModifiers: TSimpleOrderItemModifierWithGroup[]) => void
    selectedModifiers: TSimpleOrderItemModifierWithGroup[]
}

const RadioboxModifier: FC<Props> = ({ modifierGroup, notSelectedRequiredModifiers, onChange, selectedModifiers }) => {
    const setModifier = useCallback(
        (modifierId: number) => {
            const selectedModifier = modifierGroup.modifiers.filter((modifier) => {
                if (modifierId == modifier.id) {
                    return true
                }

                return false
            })

            if (selectedModifier.length) {
                const state = [
                    {
                        id: selectedModifier[0].id,
                        group_id: modifierGroup.id,
                        amount: 1,
                        weight: selectedModifier[0].weight,
                        energy_amount: selectedModifier[0].energy_amount,
                        protein_amount: selectedModifier[0].protein_amount,
                        fat_amount: selectedModifier[0].fat_amount,
                        carbohydrate_amount: selectedModifier[0].carbohydrate_amount,
                        fiber_amount: selectedModifier[0].fiber_amount,
                        name: selectedModifier[0].name,
                    },
                ]

                onChange(state)
            }
        },
        [onChange, modifierGroup],
    )

    const selectedModifier = useMemo(() => {
        return selectedModifiers.map((modifier) => modifier.id)
    }, [selectedModifiers])

    const errored = useMemo(() => {
        const found = notSelectedRequiredModifiers.filter((modifier) => {
            if (modifierGroup.id == modifier.id) {
                return true
            }

            return false
        })

        if (found.length) {
            return true
        }

        return false
    }, [modifierGroup, notSelectedRequiredModifiers])

    const modifiersSorted = useMemo(() => {
        return [...modifierGroup.modifiers].sort((a, b) => {
            return a.order - b.order
        })
    }, [modifierGroup.modifiers])

    return (
        <div className='modifiers d-flex flex-wrap'>
            {modifierGroup.modifiers.length ? (
                <div className='modifiers-block d-flex flex-wrap' id={'modifier_' + modifierGroup.id}>
                    <div className={classNames(styles.title, { [styles.errored]: errored })}>
                        {modifierGroup.name == null ? 'Дополнительно' : modifierGroup.name}:
                    </div>
                    {errored && <div className={styles.errorText}>Пожалуйста, выберите подходящий вариант</div>}
                    <div className='modifiers-list d-flex flex-wrap justify-between'>
                        {modifiersSorted.map((modifier) => (
                            <div key={modifier.id} className='modifiers-list__item d-flex items-center justify-between'>
                                <div className='modifiers-list__item-checkbox'>
                                    <Radiobox
                                        checkedValue={selectedModifier[0]}
                                        label={modifier.name}
                                        onChange={setModifier}
                                        value={modifier.id}
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

export { RadioboxModifier }
