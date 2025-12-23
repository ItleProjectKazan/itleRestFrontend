import React, { FC } from 'react'

import { Radiobox, Section } from '~/components'

import { TPaymentMethod } from '~/types/order'
import styles from '../Checkout.module.scss'

type Props = {
    onlinePaymentsAvailable: boolean
    paymentMethod: TPaymentMethod | null
    setPaymentMethod: (method: TPaymentMethod) => void
}

export const Payment: FC<Props> = ({
    onlinePaymentsAvailable,
    paymentMethod: currentType,
    setPaymentMethod: setType,
}) => {
    return (
        <div className="checkout-page__content-row d-flex flex-wrap">
            <div className="checkout-page__content-title" style={{marginBottom: '0px'}}><span>Способы</span> оплаты</div>
            <div className={styles.blockContent}>
                {onlinePaymentsAvailable &&
                    <Radiobox
                        checkedValue={currentType}
                        onChange={setType}
                        value={TPaymentMethod.CARD_ONLINE}
                        label='Банковская карта'
                        description='Онлайн оплата на сайте'
                    />
                }
                <Radiobox
                    label='При получении'
                    checkedValue={currentType}
                    onChange={setType}
                    value={TPaymentMethod.CARD_COURIER}
                    description='Картой курьеру' />
                {onlinePaymentsAvailable &&
                    <Radiobox
                        checkedValue={currentType}
                        onChange={setType}
                        value={TPaymentMethod.CASH}
                        label='Наличными'
                        description='Оплата наличными'
                    />
                }
            </div>
        </div>
    )
}
