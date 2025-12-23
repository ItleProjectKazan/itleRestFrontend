import { FC } from 'react'
import classNames from 'classnames'

import styles from './DiamondLabel.module.scss'

interface Props {
    color: 'primary' | 'secondary'
    label: string
    size: number
}

export const DiamondLabel: FC<Props> = ({
    color,
    label,
    size,
}) => {
    return (
        <div
            className={ classNames(styles.diamond, {
                [styles.diamondPrimary]: color === 'primary',
                [styles.diamondSecondary]: color === 'secondary',
            }) }
            style={{
                width: size,
                height: size,
                fontSize: Math.round(size / 4),
            }}
        >
            { label }
        </div>
    )
}
