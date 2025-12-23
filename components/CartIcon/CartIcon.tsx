/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useCallback } from 'react'
import { addDays, format } from 'date-fns'
import { Button, Modal } from '~/components'
import { useCurrentRestaurant, useCart, useCheckRestaurantAvailable, useCurrentLocality, useStore } from '~/hooks'
import styles from './CartIcon.module.scss'
import { getRestaurantClosingTime } from '~/helpers/getRestaurantClosingTime'
import { getRestaurantOpeningTime } from '~/helpers/getRestaurantOpeningTime'
import { findLocalityByRestaurant } from '~/helpers'
import { useSheduleInfoModal } from '~/context/SheduleInfoModal/useSheduleInfoModal/useSheduleInfoModal'

const CartIcon = () => {
    const { totalQuantity /*, items*/ } = useCart()
    const { cartModal, localities, orderParams } = useStore()
    const { sheduleInfoModalOpen, toggleSheduleInfoModal } = useSheduleInfoModal()
    const closeSheduleInfoModal = () => {
        toggleSheduleInfoModal(false)
        cartModal.open()
    }

    const restaurantId = orderParams !== null ? orderParams.restaurantId : null
    const currentLocality = useCurrentLocality()
    const currentRestaurant = useCurrentRestaurant()

    const locality = restaurantId ? findLocalityByRestaurant(localities, restaurantId) : currentLocality

    const closingTime = getRestaurantClosingTime(locality, restaurantId)
    const openingTime = getRestaurantOpeningTime(locality, restaurantId)

    const closingTimeTomorrow = getRestaurantClosingTime(locality, restaurantId, addDays(new Date(), 1))
    const openingTimeTomorrow = getRestaurantOpeningTime(locality, restaurantId, addDays(new Date(), 1))
    const isRestaurantIsStillOpening = useCallback(() => {
        if (!closingTime || !openingTime) return false
        const f: string[] = openingTime.split(':')
        const t: string[] = closingTime.split(':')

        if (f.length !== 2 || t.length !== 2) return false

        const myDate = new Date(format(new Date(), 'yyyy-MM-dd'))
        myDate.setHours(Number(t[0]))
        myDate.setMinutes(Number(t[1]))

        if (new Date() < myDate) return true

        return false
    }, [closingTime, openingTime])

    const openCart = useCheckRestaurantAvailable(() => {
        if (sheduleInfoModalOpen) {
            return
        }
        if (!isRestaurantIsStillOpening()) {
            toggleSheduleInfoModal('tomorrowImg')
        } else {
            toggleSheduleInfoModal('todayImg')
        }
    })

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        openCart()
        e.preventDefault()
        e.stopPropagation()
    }

    return (
        <>
            <Modal
                open={sheduleInfoModalOpen === 'tomorrowImg' || sheduleInfoModalOpen === 'todayImg'}
                className={styles.sheduleInfoModal}
                containerClass={styles.sheduleInfoModalContainer}
                onClose={closeSheduleInfoModal}
            >
                <div className={styles.modalHeader}>{currentRestaurant?.schedule_modal?.title}</div>
                {currentRestaurant?.schedule_modal?.is_default_title ? (
                    <div className={styles.modalInfo}>
                        {sheduleInfoModalOpen === 'tomorrow' ? 'Завтра' : 'Сегодня'} мы работаем с{' '}
                        {sheduleInfoModalOpen === 'tomorrow' ? openingTimeTomorrow : openingTime} до{' '}
                        {sheduleInfoModalOpen === 'tomorrow' ? closingTimeTomorrow : closingTime}
                    </div>
                ) : null}
                <div dangerouslySetInnerHTML={{ __html: currentRestaurant?.schedule_modal?.text || '' }}></div>
                <Button className={styles.modalButton} onClick={closeSheduleInfoModal}>
                    Прекрасно
                </Button>
            </Modal>

            {/* <a /*ref={setCartRef}/ onClick={handleClick}> */}
            <span onClick={handleClick}>
                {totalQuantity > 0 && <span className={styles.productCount}>{totalQuantity}</span>}
            </span>

            {/* {showTooltip && cartRef !== null && lastItem !== null && (
                <Tooltip key={lastItem.id} anchorEl={cartRef} placement='bottom-start'>
                    <div className='d-flex flex-column'>
                        <Typography className={styles.popoverText}>Добавлено:&nbsp;{lastItem.product.name}</Typography>
                    </div>
                </Tooltip>
            )} */}
        </>
    )
}

export { CartIcon }
