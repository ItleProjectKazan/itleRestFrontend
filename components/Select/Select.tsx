import React, { FC } from 'react'
import ReactSelect, { Props as ReactSelectProps } from 'react-select'
import cn from 'classnames'
import styles from './Select.module.scss'

const Select: FC<ReactSelectProps> = (props) => {
    const customStyles: ReactSelectProps['styles'] = {
        singleValue: (provided: any, state: any) => {
            const opacity = state.isDisabled ? 0.5 : 1
            const transition = 'opacity 300ms'

            return {
                ...provided,
                opacity,
                transition,
                color: 'var(--brown-dark)',
            }
        },
    }

    return (
        //@ts-ignore
        <div className={cn({ [styles.error]: props?.error })}>
            <ReactSelect
                className={styles.select}
                classNamePrefix='react-select'
                closeMenuOnScroll
                closeMenuOnSelect
                instanceId={props.instanceId}
                // absolute: корректно в списке, некорректно в модале. fixed – наоборот, проблемы в модале
                isSearchable={false}
                menuPosition={props.menuPosition ? props.menuPosition : 'fixed'}
                menuShouldBlockScroll={props.menuShouldBlockScroll ? props.menuShouldBlockScroll : true}
                options={props.options}
                styles={customStyles}
                {...props}
            />
            {props?.placeholder && <div className="select-label"> {props.placeholder}</div>}
        </div>
    )
}

export { Select }
