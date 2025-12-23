import React, { FC, useCallback } from 'react'
import Image from 'next/legacy/image'
import { memoize } from 'lodash'
import classNames from 'classnames'

import { Button } from '~/components'

import commonStyles from './Common.module.scss'
import styles from './DeliveryNotPossible.module.scss'

interface Props {
    onPickupAnswer: (usePickup: boolean) => void
}

const DeliveryNotPossible: FC<Props> = ({ onPickupAnswer }) => {
    const handleButtonClick = useCallback(
        memoize((usePickup: boolean) => () => {
            onPickupAnswer(usePickup)
        }),
        [onPickupAnswer],
    )

    return (
        <div className={classNames(commonStyles.container, styles.root)}>
            <Image alt='' height={50} src='/images/sad-tray.svg' width={64} />
            <div className={styles.description}>
                К сожалению, мы временно не доставляем по данному адресу.
                <br />
                Хотите воспользоваться самовывозом?
            </div>
            <div className={styles.buttons}>
                <Button color='primary' onClick={handleButtonClick(true)}>
                    Да
                </Button>
                <Button color='secondary' onClick={handleButtonClick(false)}>
                    Нет
                </Button>
            </div>
        </div>
    )
}

export { DeliveryNotPossible }
