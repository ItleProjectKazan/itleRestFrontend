import React, { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { Modal } from '~/components'
import { useStore } from '~/hooks'
import { Button, Typography } from '~/components'
import styles from './TextModal.module.scss'

interface ITextModal {
    onClose: () => void
    open: boolean
}

const TextModal: FC<ITextModal> = observer(({ onClose, open }: ITextModal) => {
    const { textModal } = useStore()
    return (
        <>
            <Modal className={styles.modal} onClose={onClose} open={open}>
                <Typography className={styles.title}>{textModal.title}</Typography>
                <Typography className={styles.description}>{textModal.text}</Typography>
                <Button onClick={textModal.close}>Хорошо</Button>
            </Modal>
        </>
    )
})

export { TextModal }
