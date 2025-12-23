/* eslint-disable no-empty */
import React, { FC, useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { format } from 'date-fns'
import { CartService } from '~/services/cart/cartService'
import { TCartAppendBonuses, TCartResetBonuses } from '~/services/cart/types'
import { useCart, useStore, usePrevious } from '~/hooks'
import EmptyWallet from '~/public/images/empty-wallet.svg'
import styles from './BonusesRow.module.scss'
import { Input } from '~/components/Inputs/Input'

type Props = {
    allowDiscounts: (type: string) => void
}

export const BonusesRow: FC<Props> = observer(({ allowDiscounts }) => {
    const cart = useCart()
    const store = useStore()
    const { user, bonusesModal } = store
    const [bonusesSuccess, setBonusesSuccess] = useState(false)
    const [bonus_used, useBonuses] = useState(cart.bonus_used !== null ? cart.bonus_used : 0)
    const [bonusesModalShown, setBonusesModalShown] = useState(false)
    const prevModal = usePrevious(bonusesModal.isOpen)

    useEffect(() => {
        if (prevModal === true && bonusesModal.isOpen !== prevModal && bonusesModal.result) {
            setBonusesModalShown(true)
        }
    }, [prevModal, bonusesModal])

    useEffect(() => {
        if (cart.bonus_used > 0) {
            setBonusesSuccess(true)
            allowDiscounts('bonuses')
        } else {
            useBonuses(0)
        }
    }, [allowDiscounts, cart.bonus_used])

    if (user == null || user.bonus_count == null) {
        return null
    }

    const bonuses_amount =
        cart.bonus_used > 0 ? cart.bonus_used : cart.bonus_max > user.bonus_count ? user.bonus_count : cart.bonus_max

    const validateInputtedAmount = useCallback(
        (string: string) => {
            if (string.length) {
                if (string == '-') {
                    string = '0'
                }
                if (parseInt(string) < 0) {
                    string = '0'
                }
                if (string.length > 4) {
                    string = string.substr(0, 4)
                }

                if (parseInt(string) > bonuses_amount) {
                    useBonuses(bonuses_amount)
                } else {
                    useBonuses(parseInt(string))
                }
            } else {
                useBonuses(0)
            }
        },
        [bonuses_amount],
    )

    const appendBonuses = async () => {
        if (cart.bonus_max < bonus_used) {
            setBonusesSuccess(false)
            return
        }
        if (!bonusesModalShown) {
            if (bonus_used > 0) {
                bonusesModal.open()

                return
            }
        }

        const cartId = cart.id

        try {
            const result = await CartService.appendBonuses({
                bonus_used: bonus_used,
                order_id: cartId,
            } as TCartAppendBonuses)

            if (result) {
                setBonusesSuccess(true)
                allowDiscounts('bonuses')
                cart.update()
            }
        } catch (error: any) {
            setBonusesSuccess(false)
            allowDiscounts('')
        }
    }

    const resetBonuses = async () => {
        const cartId = cart.id

        try {
            await CartService.resetBonuses({
                order_id: cartId,
            } as TCartResetBonuses)

            setBonusesSuccess(false)
            allowDiscounts('')

            cart.update()
        } catch (error: any) {}
    }

    const prevModalShown = usePrevious(bonusesModalShown)
    useEffect(() => {
        if (prevModalShown !== bonusesModalShown) {
            if (prevModalShown !== null && bonus_used > 0) {
                appendBonuses()
            }
        } else {
            if (!bonusesModal.result && cart.bonus_used > 0) {
                resetBonuses()
            }
        }
    }, [appendBonuses, bonusesModal, prevModalShown, resetBonuses, bonusesModalShown, cart.bonus_used, bonus_used])

    const bonues_max_to_use = cart.bonus_max <= user?.bonus_count ? cart.bonus_max : user?.bonus_count

    return (
        <div className='checkout-page__content-row d-flex flex-wrap' style={{ marginTop: '20px' }}>
            <div className='checkout-page__content-title'>
                <span>Списать</span> бонусы
            </div>
            <div className={styles.blockContent}>
                <Input
                    label='Сколько списать бонусов?'
                    width='big'
                    isWithEvent={true}
                    onChange={(value) => validateInputtedAmount(value)}
                    type='number'
                    value={bonus_used == 0 ? '' : bonus_used}
                    eventAction={bonus_used > 0 && bonusesSuccess ? resetBonuses : appendBonuses}
                    buttonLabel={bonus_used > 0 && bonusesSuccess ? 'Отменить' : 'Применить'}
                />

                <div className={styles.info}>
                    <div className={styles.infoIcon}>
                        <EmptyWallet />
                    </div>
                    <div className={styles.infoMain}>
                        <div className={styles.infoMainHeader}>Доступно бонусов</div>
                        <div className={styles.infoMainLabel}>{bonues_max_to_use} ₽</div>
                    </div>
                    <div className={styles.infoDesc}>
                        <span>Ваши бонусные баллы действуют до</span>{' '}
                        <span className={styles.bold}>
                            {user?.bonus_expiration_date
                                ? format(new Date(user?.bonus_expiration_date), 'dd.MM.yyyy')
                                : null}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
})
