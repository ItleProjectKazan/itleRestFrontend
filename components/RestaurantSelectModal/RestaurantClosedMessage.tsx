import React, { FC } from 'react'
import classNames from 'classnames'
import Image from 'next/legacy/image'

import styles from './RestaurantClosedMessage.module.scss'

interface Props {
    message: string
}

const RestaurantClosedMessage: FC<Props> = ({ message }) => {
    const smile_src = '/images/smile.png'

    return (
        <>
            {message}
            <br />
            Продолжайте{' '}
            <Image alt='Мы вам рады' className={classNames(styles.smile)} height='16' src={smile_src} width='16' />
        </>
    )
}

export { RestaurantClosedMessage }
