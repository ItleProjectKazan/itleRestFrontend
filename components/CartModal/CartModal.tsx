import React, { FC, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Modal } from '~/components'
import { CartModalContent } from '~/views/cart/CartModalContent'
import { TProduct } from '~/types/catalog'
import styles from './CartModal.module.scss'

interface Props {
    onClose: () => void
    open: boolean
    recommendedProducts: TProduct[]
}

const CartModal: FC<Props> = observer(({ onClose, open, recommendedProducts }) => {
    const modalRef = useRef<HTMLElement | null>(null)

    return (
        <Modal
            ref={modalRef}
            className={styles.modal}
            containerClass={styles.modalContainer}
            onClose={onClose}
            open={open}
        >
            <div className={styles.container}>
                <CartModalContent recommendedProducts={recommendedProducts} />
            </div>
        </Modal>
    )
})

export { CartModal }
