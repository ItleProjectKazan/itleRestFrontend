import { FC } from 'react'

import { Step } from './Step'

import { TOrderStep } from '~/types/order'

import styles from './Stepper.module.scss'

const steps = {
    [TOrderStep.CART]: {icon: 'cart', label: 'Корзина', step_type: 'cart', step_number: 0},
    [TOrderStep.CHECKOUT]: {icon: 'list', label: 'Оформление заказа', step_type: 'checkout', step_number: 1},
    [TOrderStep.PROCESSING]: {icon: 'done', label: 'Заказ принят', step_type: 'unknown', step_number: 2},
}

interface Props {
    step: TOrderStep
}

export const Stepper: FC<Props> = ({
    step,
}) => {
    const currentStep = steps[step] ?? steps.cart

    return (
        <div className={ styles.stepper }>
            <div className="d-flex align-items-center justify-content-between">
                {
                    Object.values(steps).map((step, index) => (
                        <Step
                            key={ index }
                            active={ currentStep === step }
                            icon={ step.icon }
                            label={ step.label }
                            step_number={ step.step_number }
                            visited={ currentStep.step_number > step.step_number }
                        />
                    ))
                }
            </div>
            <div className={ styles.stepperLine } />
        </div>
    )
}
