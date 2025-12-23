import React from 'react'
import classNames from 'classnames'

import styles from './Loader.module.scss'

type Props = {
    className?: string
    white?: boolean
}

export const Loader: React.FC<Props> = ({
    className,
    white = false,
}) => {
    return (
        <div className={ classNames(styles.loader, className, { [styles.whiteDots]: white }) }>
            <div className={ styles.dot } />
            <div className={ styles.dot } />
            <div className={ styles.dot } />
        </div>
    )
}
