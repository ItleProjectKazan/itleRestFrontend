import { FC } from 'react'
import classNames from 'classnames'

import { findLocalityByRestaurant } from '~/helpers'

import { useCurrentLocality, useStore } from '~/hooks'

import { SupportPhone } from '~/constants/content'

import styles from './ContactPhone.module.scss'

import PhoneIcon from '~/public/images/icon-tel.svg'

const cleanPhoneNumber = (phoneNumber: string) => phoneNumber.replace(/[^+\d]/g, '')

type Props = {
    className?: string
}

export const ContactPhone: FC<Props> = ({ className }) => {
    const { localities, orderParams } = useStore()

    const restaurantId = orderParams !== null ? orderParams.restaurantId : null
    const currentLocalityFromHook = useCurrentLocality()
    const locality = restaurantId ? findLocalityByRestaurant(localities, restaurantId) : currentLocalityFromHook

    const supportPhoneNumber = locality?.support_phone_number ?? SupportPhone.href
    const hrefNumber =
        supportPhoneNumber !== null ? `tel:${cleanPhoneNumber(supportPhoneNumber.toString())}` : SupportPhone.href

    const content =
        hrefNumber !== null && supportPhoneNumber !== null ? (
            <div className={classNames(className, styles.contacts)}>
                <a aria-label='ИТЛЕ телефон' href={hrefNumber} rel='noreferrer'>
                    <PhoneIcon />
                    {supportPhoneNumber}
                </a>
            </div>
        ) : null

    return content
}
