import React, { FC } from 'react'
import Link from 'next/link'

import { useCurrentLocality, useStore } from '~/hooks'

import { Typography } from '~/components'

import { numToTitle, findLocalityByRestaurant } from '~/helpers'

import styles from './MobileMenu.module.scss'

import Router from 'next/router'
import { PageLinks } from '~/constants/pageLinks'

import CloseIcon from '~/public/images/close-btn.svg'
import GooglePlayLogo from '~/public/images/play-market-mobile.svg'
import Logo from '~/public/images/logo-white.svg'
import LogoutIcon from '~/public/images/logout.svg'
import PhoneIcon from '~/public/images/phone-mobile.svg'
import ProfileIcon from '~/public/images/profile-icon-mobile.svg'

import { SupportPhone } from '~/constants/content'

const API_TYPE = process.env.NEXT_TYPE

interface Props {
    onClose: () => void
}

export const MobileMenu: FC<Props> = ({ onClose }) => {
    const { localities, loginModal, user, orderParams } = useStore()

    const restaurantId = orderParams !== null ? orderParams.restaurantId : null
    const currentLocality = useCurrentLocality()
    const locality = restaurantId ? findLocalityByRestaurant(localities, restaurantId) : currentLocality

    const supportPhoneNumber = locality?.support_phone_number ?? SupportPhone.href

    const handleProfileClick = () => {
        if (user === null) {
            loginModal.open('Введите номер для авторизации', 'Это позволит Вам быстро войти в ЛК')

            return
        }

        Router.push(PageLinks.PROFILE)
    }

    return (
        <div className={styles.menu}>
            <div className={styles.closeBtn}>
                <CloseIcon className={styles.close} height={18} onClick={onClose} width={18} />
            </div>
            <div className={styles.logo}>
                <Link href='/' onClick={onClose}>
                    <Logo height={21} width={88} />
                </Link>
            </div>
            <div className={user !== null ? styles.profileLoggedIn : styles.profile}>
                <ProfileIcon height={30} onClick={handleProfileClick} width={30} />
                <div>
                    <div className={styles.profileLabel} onClick={handleProfileClick}>
                        {user !== null ? (user.name ?? 'Клиент') : 'Войти'}
                    </div>
                    {user !== null && (
                        <div className={styles.bonusesCount} onClick={handleProfileClick}>
                            У вас {user.bonus_count ?? 0} бонус{numToTitle(user.bonus_count ?? 0, ['', 'а', 'ов'])}
                        </div>
                    )}
                    {user !== null && (
                        <div className={styles.logoutText} onClick={user.logOut}>
                            <span>Выйти</span>
                            <LogoutIcon className={styles.logoutIcon} onClick={user.logOut} />
                        </div>
                    )}
                </div>
            </div>
            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    <li>
                        <Link
                            className={styles.navItem}
                            onClick={onClose}
                            as={'/' + locality?.slug + '#menu'}
                            href={'/' + locality?.slug + '#menu'}
                        >
                            Меню
                        </Link>
                    </li>
                    <li>
                        <Link as='/promos' href='/promos' className={styles.navItem} onClick={onClose}>
                            Акции
                        </Link>
                    </li>
                    <li>
                        <Link as='/info/bonuses' href='/info/bonuses' className={styles.navItem} onClick={onClose}>
                            Бонусы
                        </Link>
                    </li>
                    {API_TYPE == 'bistro' && restaurantId !== 7 && restaurantId !== 11 ? (
                        <li>
                            <Link as='/hall' href='/hall' className={styles.navItem} onClick={onClose}>
                                Банкеты
                            </Link>
                        </li>
                    ) : null}
                    <li>
                        <Link as='/info/about' href='/info/about' className={styles.navItem} onClick={onClose}>
                            О нас
                        </Link>
                    </li>
                    <li>
                        <Link as='/contacts' href='/contacts' className={styles.navItem} onClick={onClose}>
                            Контакты
                        </Link>
                    </li>
                </ul>
            </nav>
            <a className={styles.contacts} href={SupportPhone.href}>
                <PhoneIcon height={20} width={20} />
                <Typography lineHeight={25} size={20} weight='bold'>
                    {supportPhoneNumber}
                </Typography>
            </a>
            <div className={styles.apps}>
                <GooglePlayLogo height={41} width={123} />
            </div>
        </div>
    )
}
