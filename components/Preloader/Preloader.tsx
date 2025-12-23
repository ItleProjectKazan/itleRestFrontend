import React from 'react'
import classNames from 'classnames'

import styles from './Preloader.module.scss'

type Props = {
    className?: string
    contrast?: boolean
}

/**
 * Индикатор состояния загрузки (infinite)
 */
export const Preloader: React.FC<Props> = ({
    className,
    contrast,
}) => {
    return (
        <div className={ classNames(styles.preloader, contrast ? styles.contrast : null, className) }>
            <div /><div /><div />
        </div>
    )
}

