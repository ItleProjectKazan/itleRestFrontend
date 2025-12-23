import { useStore } from '~/hooks'

import { Modal, Typography, Button } from '~/components'

import styles from './SuccessfullReserveModal.module.scss'

const SuccessfullReserveModal = () => {

    const { successfullReserveModal } = useStore()

    return (
        <Modal className={ styles.modal } onClose={ successfullReserveModal.close } open={ successfullReserveModal.isOpen }>
            <Typography
                className={ styles.title }
                lineHeight={ 34 }
                size={ 36 }
            >
                Заявка на бронирование отправлена
            </Typography>
            <div className={ styles.subTitle }>
                <Typography>
                    Наш менеджер свяжется с вами в ближайшее время
                </Typography>
            </div>
            <Button
                className={ styles.button }
                onClick={ successfullReserveModal.close }
            >
                Хорошо
            </Button>
        </Modal>
    )
}

export { SuccessfullReserveModal }
