import React, { FC } from 'react'
import { observer } from 'mobx-react-lite'

import { useCurrentRestaurant } from '~/hooks'

import { Modal } from '~/components'
import { RestaurantClosed } from './RestaurantClosed'

import styles from './RestaurantClosedModal.module.scss'

interface Props {
    onClose: () => void
    open: boolean
}

const RestaurantClosedModal: FC<Props> = observer(({
    onClose,
    open,
}) => {
    const restaurant = useCurrentRestaurant()

    if (restaurant === null) {
        onClose()

        return null
    }

    return (
        <Modal
            className={ styles.modal }
            onClose={ onClose }
            open={ open }
        >
            <div className={ styles.container }>
                <RestaurantClosed
                    onClose={ onClose }
                    openingHours={ restaurant.opening_hours }
                />
            </div>
        </Modal>
    )
})

export { RestaurantClosedModal }
