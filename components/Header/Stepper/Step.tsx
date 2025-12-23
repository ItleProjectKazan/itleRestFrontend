import { FC } from 'react'
import classNames from 'classnames'

import { Typography } from '~/components'

import styles from './Stepper.module.scss'

import CartIcon from '~/public/images/cart.svg'
import ListIcon from '~/public/images/list.svg'
import DoneIcon from '~/public/images/done-circle.svg'

const stepIcons = {
    cart: CartIcon,
    list: ListIcon,
    done: DoneIcon,
} as const

type Props = {
    active?: boolean
    icon: string
    label: string
    step_number: number
    visited?: boolean
}

export const Step: FC<Props> = ({
    active = false,
    icon,
    label,
    visited,
}) => {
    // @ts-ignore
    const IconComponent = stepIcons[icon] ?? stepIcons.list

    return (
        <div
            className={
                classNames(styles.step, {
                    [styles.active]: active,
                    [styles.visited]: visited,
                })
            }
        >
            <div className="d-flex align-items-center">
                <div>
                    <IconComponent />
                </div>
                <Typography className="ml-12" weight="semi-bold">
                    { label }
                </Typography>
            </div>
        </div>
    )
}
