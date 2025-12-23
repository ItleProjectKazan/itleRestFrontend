import React, { FC } from 'react'

import { StepperModifier } from './StepperModifier'
import { SelectModifier } from './SelectModifier'
import { CheckboxModifier } from './CheckboxModifier'
import { RadioboxModifier } from './RadioboxModifier'

import { TModifierGroup, TModifierControlType } from '~/types/catalog'
import { TSimpleOrderItemModifierWithGroup } from '~/types/cart'

interface Props {
    modifierGroup: TModifierGroup
    notSelectedRequiredModifiers: TModifierGroup[]
    onChange: (selectedModifiers: TSimpleOrderItemModifierWithGroup[]) => void
    selectedModifiers: TSimpleOrderItemModifierWithGroup[]
}

const GroupModifier: FC<Props> = ({ modifierGroup, notSelectedRequiredModifiers, onChange, selectedModifiers }) => {
    const controlType = modifierGroup.control_type ?? TModifierControlType.STEPPER_OUTLINED

    return (
        <>
            {(controlType === TModifierControlType.STEPPER ||
                controlType === TModifierControlType.STEPPER_OUTLINED) && (
                <StepperModifier
                    border={controlType === TModifierControlType.STEPPER_OUTLINED}
                    modifierGroup={modifierGroup}
                    onChange={onChange}
                    selectedModifiers={selectedModifiers}
                />
            )}
            {controlType === TModifierControlType.SELECT && (
                <SelectModifier
                    modifierGroup={modifierGroup}
                    onChange={onChange}
                    selectedModifiers={selectedModifiers}
                />
            )}
            {controlType === TModifierControlType.CHECKBOXES &&
                (modifierGroup.is_required == true ? (
                    <RadioboxModifier
                        modifierGroup={modifierGroup}
                        notSelectedRequiredModifiers={notSelectedRequiredModifiers}
                        onChange={onChange}
                        selectedModifiers={selectedModifiers}
                    />
                ) : (
                    <CheckboxModifier
                        modifierGroup={modifierGroup}
                        notSelectedRequiredModifiers={notSelectedRequiredModifiers}
                        onChange={onChange}
                        selectedModifiers={selectedModifiers}
                    />
                ))}
        </>
    )
}

export { GroupModifier }
