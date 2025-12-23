import { forwardRef, ReactElement, ReactNode } from 'react'
import ReactModal from 'react-modal'
import classNames from 'classnames'

import styles from './Modal.module.scss'
import { useDisableBodyScroll } from '~/hooks'

interface Props {
    afterContainer?: ReactElement
    children: ReactNode
    className?: string
    containerClass?: string
    id?: string
    onClose?: () => void
    open: boolean
    style?: object
}

const Modal = forwardRef<any, Props>(
    ({ afterContainer, children, className, containerClass, id, onClose, open, style }, ref) => {
        useDisableBodyScroll(open)

        return (
            <ReactModal
                className={classNames(styles.modal, className)}
                isOpen={open}
                onRequestClose={onClose}
                overlayClassName={styles.overlay}
            >
                {onClose !== undefined && (
                    <div className={styles.closeButton} onClick={onClose}>
                        <span className={styles.closeIcon}></span>
                    </div>
                )}
                <div ref={ref} className={classNames(styles.modalContainer, containerClass)} style={style} id={id}>
                    {children}
                </div>
                {afterContainer}
            </ReactModal>
        )
    },
)

Modal.displayName = 'Modal'

ReactModal.setAppElement('#__next')

export { Modal }
