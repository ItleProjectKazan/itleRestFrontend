import React from 'react'
import classNames from 'classnames'

export type ResultClasses = {
    content?: string | string[]
    icon?: string | string[]
    root?: string | string[]
    subtitle?: string | string[]
    title?: string | string[]
};

type Props = {
    children?: React.ReactNode
    classes?: ResultClasses
    icon?: any
    prefixCls?: string
    style?: React.CSSProperties
    subtitle?: string
    title: string
}

export const Result: React.FC<Props> = ({
    children,
    classes,
    icon,
    style,
    subtitle,
    title,
})  => {
    const rootClasses = classNames('d-flex flex-column align-items-center', classes?.root)
    const titleClasses = classNames(classes?.title)
    const subtitleClasses = classNames(classes?.subtitle)
    const contentClasses = classNames(classes?.content)
    const iconClasses = classNames('d-flex align-items-center justify-content-center mb-28', classes?.icon)

    return (
        <div className={ rootClasses } style={ style }>
            {
                icon !== undefined &&
                React.createElement(icon, {
                    className: iconClasses,
                })
            }
            <span className={ titleClasses }>{ title }</span>
            { subtitle && <div className={ subtitleClasses }>{ subtitle }</div> }
            { children && <div className={ contentClasses }>{ children }</div> }
        </div>
    )
}
