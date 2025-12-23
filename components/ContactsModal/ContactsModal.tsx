import { FC } from 'react'
import Router from 'next/router'

import { PageLinks } from '~/constants/pageLinks'
import { useCurrentLocality, useStore } from '~/hooks'
import { findLocalityByRestaurant } from '~/helpers'
import { Modal, Button, Typography } from '~/components'
import { SupportPhone } from '~/constants/content'

import styles from './ContactsModal.module.scss'

interface Props {
    onClose: () => void
    open: boolean
}

const ContactsModal: FC<Props> = ({
    onClose,
    open,
}) => {
    const { localities, orderParams } = useStore()

    const restaurantId = orderParams !== null ? orderParams.restaurantId :  null
    const currentLocality = useCurrentLocality()
    const locality = restaurantId ? findLocalityByRestaurant(localities, restaurantId) : currentLocality

    const supportPhoneNumber = locality?.support_phone_number ?? SupportPhone.href

    const goToContacts = () =>
    {
        Router.push(PageLinks.CONTACTS)
        onClose()
    }

    return (
        <Modal className={ styles.modal } onClose={ onClose } open={ open }>
            <a className={ styles.contacts } href={ SupportPhone.href }>
                <Typography lineHeight={ 20 } size={ 16 } weight="bold">
                    { supportPhoneNumber }
                </Typography>
            </a>
            <Button
                className={ styles.reserveButton }
                onClick={ goToContacts }
            >
                Забронировать стол
            </Button>
            <Button
                className={ styles.contactsButton }
                onClick={ goToContacts }
            >
                Контакты
            </Button>
        </Modal>
    )
}

export { ContactsModal }
