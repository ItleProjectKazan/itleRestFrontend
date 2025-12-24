import React, { FC } from 'react'
import { Modal } from '~/components/Modal/Modal'
import { AppLinks } from '~/constants/appLinks'
import styles from './AppQRModal.module.scss'

interface Props {
    open: boolean
    onClose: () => void
}

export const AppQRModal: FC<Props> = ({ open, onClose }) => {
    return (
        <Modal open={open} onClose={onClose} className={styles.modal} containerClass={styles.modalContainer}>
            <div className={styles.content}>
                <h2 className={styles.title}>
                    ОТСКАНИРУЙТЕ<br />
                    QR КОД
                </h2>
                <div className={styles.qrCodeContainer}>
                    <img
                        src={AppLinks.qrCodeImage}
                        alt="QR код для скачивания приложения"
                        className={styles.qrCode}
                    />
                </div>
            </div>
        </Modal>
    )
}
