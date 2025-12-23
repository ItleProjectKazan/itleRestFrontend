import React, { FC } from 'react'

import { Modal, Button } from '~/components'

import styles from './PromocodeModal.module.scss'

import BonusesCoins from '~/public/images/bonuses_coins.svg'

interface Props {
    onClose: () => void
    open: boolean
    promocode: string
    setResult: (result: boolean) => void
}

const PromocodeModal: FC<Props> = ({ onClose, open, promocode, setResult }) => {
    const cancelCode = () => {
        setResult(false)
        onClose()
    }
    const onCloseClick = () => {
        setResult(true)
        onClose()
    }

    return (
        <Modal className={styles.modal} onClose={cancelCode} open={open}>
            <BonusesCoins />
            <div className={styles.subTitle}>
                При использовании промокода {promocode} вы не сможете использовать баллы в заказе
            </div>
            <div className={styles.buttons}>
                <Button className='ml-auto' color='primary' onClick={onCloseClick} size='small'>
                    Согласен
                </Button>
                <Button className='cancel-button ml-auto' color='secondary' onClick={cancelCode} size='small'>
                    Отменить код
                </Button>
            </div>
        </Modal>
    )
}

export { PromocodeModal }
