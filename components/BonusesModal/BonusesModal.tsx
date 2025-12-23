import { FC } from 'react'
import { Modal, Button } from '~/components'
import styles from './BonusesModal.module.scss'
import BonusesCoins from '~/public/images/bonuses_coins.svg'

interface Props {
    onClose: () => void
    open: boolean
    setResult: (result: boolean) => void
}

const BonusesModal: FC<Props> = ({ onClose, open, setResult }) => {
    const cancelCode = () => {
        setResult(false)
        onClose()
    }

    return (
        <Modal className={styles.modal} onClose={onClose} open={open}>
            <BonusesCoins />
            <div className={styles.subTitle}>
                При использовании бонусных баллов вы не сможете использовать промокод в заказе
            </div>
            <div className={styles.buttons}>
                <Button className='ml-auto' color='primary' onClick={onClose} size='small'>
                    Согласен
                </Button>
                <Button className='cancel-button ml-auto' color='secondary' onClick={cancelCode} size='small'>
                    Отменить
                </Button>
            </div>
        </Modal>
    )
}

export { BonusesModal }
