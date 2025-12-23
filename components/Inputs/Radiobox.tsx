import React, { FC, ElementType } from 'react'
import classNames from 'classnames'
import styles from './Radiobox.module.scss'

interface Props {
    checkedValue?: any
    className?: string
    icon?: string
    label: string
    description?: string
    onChange?: (value: any) => void
    value: any
}

export const Radiobox: FC<Props> = ({
    checkedValue = true,
    className,
    icon,
    label,
    description,
    onChange,
    value,
}) => {

    const checked = checkedValue === value
    const IconComponent = icon as ElementType ?? <span />

    return (
        <div
            className={ classNames(styles.wrap, className, {
                [styles.checkedWrap]: checked,
                [styles.bgWhite]: !!description,
            }) }
            onClick={ () => {
                if (onChange) {
                    onChange(value)
                }
            } }
        >
            <div
                className={ classNames( styles.radiobox, {
                    [styles.checked]: checked,
                    [styles.smallIcon]: !!description,
                }) }
            >
                <span className="icon-check"></span>
            </div>
            
            <div className={ classNames(styles.label, { [styles.notBoldLabel]: !!description}) }>
                { icon !== undefined ? <span className={ styles.icon }><IconComponent /></span> : null }
                <span>{ label }</span>

                {!!description && <div className={ styles.description }>{ description }</div>}
            </div>
        </div>
    )
}
