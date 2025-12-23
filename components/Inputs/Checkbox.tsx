import { FC, ReactElement } from 'react'
import classNames from 'classnames'

import styles from './Checkbox.module.scss'

interface Props {
    className?: string
    checked: boolean
    inline?: boolean
    label: string | ReactElement
    onChange: (checked: boolean) => void
}

export const Checkbox: FC<Props> = ({ className, checked, inline, label, onChange }) => {
    const handleClick = () => {
        onChange(!checked)
    }

    return (
        <div
            className={classNames(styles.root, className, {
                [styles.rootInline]: inline,
            })}
        >
            <div
                className={classNames(styles.checkbox, {
                    [styles.checkboxChecked]: checked,
                })}
                onClick={handleClick}
            >
                <span className='icon-check'></span>
            </div>
            <div className={styles.label} onClick={handleClick}>
                {label}
            </div>
        </div>
    )
}
