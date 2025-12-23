/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { observer } from 'mobx-react-lite'
import Router, { useRouter } from 'next/router'
import { addDays } from 'date-fns'
import format from 'date-fns/format'
import { PageLinks, getMenuLink } from '~/constants/pageLinks'
import { useCart, useCheckRestaurantAvailable, useCurrentLocality, useStore, useCurrentRestaurant } from '~/hooks'
import { findLocalityByRestaurant } from '~/helpers'
import { Button, CartIcon, Modal } from '~/components'
import { Location } from './Location'
import { SupportPhone } from '~/constants/content'
import { TOrderStep } from '~/types/order'
import styles from './Header.module.scss'
import Logo from '~/public/images/logo-bistro.svg'
import { getRestaurantClosingTime } from '~/helpers/getRestaurantClosingTime'
import { getRestaurantOpeningTime } from '~/helpers/getRestaurantOpeningTime'
import { useSheduleInfoModal } from '~/context/SheduleInfoModal/useSheduleInfoModal/useSheduleInfoModal'
import { normalizePhone, addYm } from '~/helpers'
import cn from 'classnames'

interface IHeader {
    orderStep?: TOrderStep
}

const Header: FC<IHeader> = observer(() => {
    const {
        localities,
        loginModal,
        bookingModal,
        user,
        cartModal,
        orderParams,
        bonusesModal,
        contactsModal,
        textModal,
        promocodeModal,
        restaurantClosedModal,
        successfullReserveModal,
        restaurantSelectModal,
    } = useStore()
    const currentRestaurant = useCurrentRestaurant()
    const cart = useCart()
    const [isNeedOpenCart, setIsNeedOpenCart] = useState(false)
    const restaurantId = orderParams !== null ? orderParams.restaurantId : null
    const currentLocality = useCurrentLocality()
    const locality = restaurantId ? findLocalityByRestaurant(localities, restaurantId) : currentLocality
    const router = useRouter()
    const closingTime = getRestaurantClosingTime(locality, restaurantId)
    const openingTime = getRestaurantOpeningTime(locality, restaurantId)

    const closingTimeTomorrow = getRestaurantClosingTime(locality, restaurantId, addDays(new Date(), 1))
    const openingTimeTomorrow = getRestaurantOpeningTime(locality, restaurantId, addDays(new Date(), 1))
    const closeModals = useCallback(() => {
        bonusesModal.close()
        contactsModal.close()
        loginModal.close()
        bookingModal.close()
        textModal.close()
        promocodeModal.close()
        restaurantClosedModal.close()
        cartModal.close()
        successfullReserveModal.close()
    }, [])

    useEffect(() => {
        closeModals()
    }, [router.asPath])

    // Открытие корзины после модального окна доставки при необходимости
    useEffect(() => {
        if (isNeedOpenCart && orderParams.restaurant && !restaurantSelectModal.isOpen) {
            cartModal.open()
            setIsNeedOpenCart(false)
        }
    }, [isNeedOpenCart, orderParams.restaurant, restaurantSelectModal.isOpen])

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

    const [menuOpen, setMenuOpen] = useState(false)

    // закрытие меню прики клике за приделами меню
    useEffect(() => {
        if (typeof document === 'undefined') return
        const closeMenu = (e: Event) => {
            e.stopPropagation()
            if (e?.target) {
                const target = e.target as HTMLElement
                const isMenu = Boolean(target.closest('.header-menu'))
                if (isMenu) {
                    setMenuOpen(false)
                }
            }
        }
        document.addEventListener('click', closeMenu)
        return () => {
            if (typeof document === 'undefined') return
            document.removeEventListener('click', closeMenu)
        }
    }, [])

    const supportPhoneNumber = locality?.support_phone_number ?? SupportPhone.href

    const burgerClick = useCallback(() => {
        setMenuOpen(!menuOpen)
    }, [menuOpen])

    const handleProfileClick = () => {
        if (user === null) {
            loginModal.open('Вход на сайт', 'Сохраним адрес доставки и расскажем об акциях', PageLinks.PROFILE)
            return
        }
        closeModals()
        Router.push(PageLinks.PROFILE)
    }

    const doLogout = () => {
        if (user !== null) {
            user.logOut()
        }
    }

    const doBooking = () => {
        bookingModal.open()
    }

    const { sheduleInfoModalOpen, toggleSheduleInfoModal } = useSheduleInfoModal()

    const closeSheduleInfoModal = () => {
        toggleSheduleInfoModal(false)
        cartModal.open()
    }

    const handleHomeClick = () => {
        closeModals()
        Router.push(PageLinks.HOME)
    }

    const handleMenuClick = () => {
        closeModals()
        Router.push(getMenuLink(orderParams.restaurantId))
    }
    const handleContactsClick = () => {
        closeModals()
        Router.push(PageLinks.CONTACTS)
    }

    const handleCartClick = useCheckRestaurantAvailable(() => {
        if (sheduleInfoModalOpen) {
            return
        }
        if (!isRestaurantIsStillOpening()) {
            toggleSheduleInfoModal('tomorrow')
        } else {
            toggleSheduleInfoModal('today')
        }
    })

    const handleModalCartClick = () => {
        if (orderParams.restaurant === null) {
            restaurantSelectModal.open('')
            setIsNeedOpenCart(true)
            return
        }
        if (sheduleInfoModalOpen) {
            return
        }
        if (!isRestaurantIsStillOpening()) {
            toggleSheduleInfoModal('tomorrow')
        } else {
            toggleSheduleInfoModal('today')
        }
    }

    const onPhoneClick = () => {
        addYm('reachGoal', 'tel')
    }
    return (
        <>
            <header className={'header transition' + (menuOpen ? ' show-menu' : ' ')}>
                <div className='container'>
                    <div className='header__inner d-flex items-center'>
                        <div className='header__burger d-flex block-center transition noselect' onClick={burgerClick}>
                            <div className='header__burger-block d-flex flex-column'>
                                <span className='burger-line'></span>
                                <span className='burger-line'></span>
                                <span className='burger-line'></span>
                            </div>
                        </div>

                        <Link aria-label='ИТЛЕ' className='header__logo' href='/'>
                            <Logo height={46} />
                        </Link>
                        <Location />
                        <div className='header__right d-flex items-center'>
                            <nav className='header__menu d-flex'>
                                <Link
                                    className='header__menu-link transition'
                                    href={getMenuLink(orderParams.restaurantId)}
                                >
                                    Меню
                                </Link>
                                <Link href={PageLinks.INTERIOR} className='header__menu-link transition'>
                                    Локации
                                </Link>
                            </nav>

                            <a
                                href={`tel:${normalizePhone(supportPhoneNumber)}`}
                                onClick={onPhoneClick}
                                aria-label='ИТЛЕ телефон'
                                className='header__phone d-flex items-center justify-center'
                            >
                                <span className='icon-phone'></span>
                                <span className='header__phone-text'>{supportPhoneNumber}</span>
                            </a>

                            <div className='header__buttons d-flex transition'>
                                <button
                                    className='header__buttons-btn d-flex items-center transition'
                                    onClick={doBooking}
                                >
                                    Забронировать
                                </button>
                                <button
                                    className='header__buttons-btn d-flex items-center transition'
                                    onClick={handleCartClick}
                                >
                                    <CartIcon />
                                    <span className='icon-cart'></span>
                                    <label className={styles.cartButtonLabel}>Корзина</label>
                                </button>
                            </div>

                            <button
                                className='header__profile d-flex block-center transition'
                                aria-label='Profile'
                                onClick={handleProfileClick}
                            >
                                <span className='icon-user'></span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className='header-menu transition'>
                    <div className='header-menu__wrap'>
                        <div className='container'>
                            <div className='header-menu__inner d-flex flex-wrap items-start'>
                                <div className='header-menu__info d-flex'>
                                    <div className='header-menu__info-column d-flex flex-column'>
                                        {<Location />}

                                        <nav className='header-menu__nav d-flex flex-wrap'>
                                            {/*
                                            <a href='' className='header-menu__nav-link transition'>
                                                Отзывы
                                            </a>
                                             <a href='' className='header-menu__nav-link transition'>
                                                Бонусы
                                            </a>
                                            */}
                                            <Link href={PageLinks.ABOUT} className='header-menu__nav-link transition'>
                                                О проекте
                                            </Link>
                                            <Link
                                                href={getMenuLink(orderParams.restaurantId)}
                                                className='header-menu__nav-link transition'
                                            >
                                                Меню
                                            </Link>
                                            <Link href={PageLinks.NEWS} className='header-menu__nav-link transition'>
                                                События
                                            </Link>
                                            {/*<Link
                                                href={PageLinks.OUR_CAFES}
                                                className='header-menu__nav-link transition'
                                            >
                                                Наши стейк-кафе
                                            </Link>*/}
                                            <Link
                                                href={PageLinks.INTERIOR}
                                                className='header-menu__nav-link transition'
                                            >
                                                Локации
                                            </Link>
                                            {/* <Link href={PageLinks.PROMOS} className='header-menu__nav-link transition'>
                                                Акции
                                            </Link> */}
                                            <Link href={PageLinks.VACANCY} className='header-menu__nav-link transition'>
                                                Вакансии
                                            </Link>
                                            <Link
                                                href={PageLinks.CONTACTS}
                                                className='header-menu__nav-link transition'
                                            >
                                                Контакты
                                            </Link>
                                        </nav>
                                    </div>

                                    <div className='header-menu__info-column d-flex flex-column'>
                                        <div
                                            className='header-menu__profile d-flex items-center transition'
                                            onClick={handleProfileClick}
                                        >
                                            <div className='header-menu__profile-icon d-flex block-center'>
                                                <span className='icon-user'></span>
                                            </div>

                                            <div className='header-menu__profile-info d-flex flex-column'>
                                                {/*<span className="header-menu__profile-title">Войти</span>*/}
                                                <span className='header-menu__profile-title'>{user?.name}</span>
                                                <span className='header-menu__profile-text'>Мой профиль</span>
                                            </div>

                                            <span
                                                onClick={doLogout}
                                                className='header-menu__profile-logout icon-logout transition'
                                            ></span>
                                            {/*Выход с профиля*/}
                                        </div>

                                        <div className='header-menu__categories d-flex flex-column items-start'>
                                            <a
                                                href='https://itle-bistro.ru'
                                                className='header-menu__category d-flex items-center'
                                            >
                                                <span className='header-menu__category-icon transition icon-bistro-color'>
                                                    <span className='path1'></span>
                                                    <span className='path2 transition'></span>
                                                </span>
                                                <div className='header-menu__category-info d-flex flex-column'>
                                                    <div className='header-menu__category-title'>ИTLe BISTRO</div>
                                                    <div className='header-menu__category-text transition'>
                                                        Семейное бистро
                                                    </div>
                                                </div>
                                            </a>

                                            <a
                                                href='https://itle-kitchen.ru'
                                                className='header-menu__category d-flex items-center'
                                            >
                                                <span className='header-menu__category-icon transition icon-kitchen-color'>
                                                    <span className='path1'></span>
                                                    <span className='path2 transition'></span>
                                                </span>
                                                <div className='header-menu__category-info d-flex flex-column'>
                                                    <div className='header-menu__category-title'>ИTLe Kitchen</div>
                                                    <div className='header-menu__category-text transition'>
                                                        Фабрика готовой еды
                                                    </div>
                                                </div>
                                            </a>

                                            <a
                                                href={getMenuLink(orderParams.restaurantId)}
                                                className='header-menu__category d-flex items-center'
                                            >
                                                <span className='header-menu__category-icon transition icon-delivery-color'>
                                                    <span className='path1'></span>
                                                    <span className='path2 transition'></span>
                                                </span>
                                                <div className='header-menu__category-info d-flex flex-column'>
                                                    <div className='header-menu__category-title'>ИTLe доставка</div>
                                                    <div className='header-menu__category-text transition'>
                                                        Быстрая доставка Halal
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className='header-menu__promo d-flex'
                                    style={{ backgroundImage: 'url(/images/promo-image-bg.png)' }}
                                >
                                    <div className='header-menu__promo-inner'>
                                        <h3 className='header-menu__promo-title'>
                                            {/* до 21 апреля */}
                                            <br />
                                            {/* стейк-кафе работает */}
                                            <br />
                                            <br />
                                            <br />
                                            {/* от заката до 23:00 */}
                                        </h3>
                                    </div>
                                </div>

                                <div className='header-menu__bottom justify-center'>
                                    <button
                                        className='header-menu__bottom-btn d-flex items-center justify-center transition'
                                        onClick={doBooking}
                                    >
                                        Забронировать
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*<nav className='mobile-menu items-center justify-around'>
                    <Link
                        href={PageLinks.HOME}
                        aria-label='На главную'
                        className={cn('mobile-menu__item icon-home transition', {
                            'is-active': router.asPath === PageLinks.HOME,
                        })}
                    />
                    <Link
                        href={getMenuLink(orderParams.restaurantId)}
                        aria-label='Меню'
                        className={cn('mobile-menu__item icon-fork-knife2 transition', {
                            'is-active': router.asPath.startsWith(PageLinks.MENU),
                        })}
                        onClick={closeModals}
                    />
                    <Link
                        href={PageLinks.CONTACTS}
                        aria-label='Контакты'
                        className={cn('mobile-menu__item icon-location-black transition', {
                            'is-active': router.asPath === PageLinks.CONTACTS,
                        })}
                        onClick={closeModals}
                    />
                    <button
                        onClick={handleProfileClick}
                        aria-label='PROFILE'
                        className={cn('mobile-menu__item icon-user-black transition', {
                            'is-active': router.asPath === PageLinks.PROFILE,
                        })}
                    ></button>
                    <button
                        onClick={handleCartClick}
                        aria-label='CHECKOUT'
                        className={cn('mobile-menu__item icon-cart transition', {
                            'is-active': router.asPath === PageLinks.CHECKOUT,
                        })}
                    >
                        {cart?.totalQuantity && cart?.totalQuantity > 0 ? (
                            <div className='mobile-menu__item-count d-flex block-center'>{cart.totalQuantity}</div>
                        ) : null}
                    </button>
                </nav>*/}
                <Modal
                    open={sheduleInfoModalOpen === 'tomorrow' || sheduleInfoModalOpen === 'today'}
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
                    <div
                        dangerouslySetInnerHTML={{ __html: currentRestaurant?.schedule_modal?.text || '' }}
                        style={{ marginTop: '15px' }}
                    ></div>
                    <Button className={styles.modalButton} onClick={closeSheduleInfoModal}>
                        Прекрасно
                    </Button>
                </Modal>
            </header>
            <nav className='mobile-menu items-center justify-around'>
                <button
                    onClick={handleHomeClick}
                    aria-label='HOME'
                    className={cn('mobile-menu__item icon-home transition', {
                        'is-active': router.asPath === PageLinks.HOME && !cartModal.isOpen,
                    })}
                ></button>
                <button
                    onClick={handleMenuClick}
                    aria-label='MENU'
                    className={cn('mobile-menu__item icon-fork-knife2 transition', {
                        'is-active': router.asPath.startsWith(PageLinks.MENU) && !cartModal.isOpen,
                    })}
                ></button>
                <button
                    onClick={handleContactsClick}
                    aria-label='CONTACTS'
                    className={cn('mobile-menu__item icon-location-black transition', {
                        'is-active': router.asPath === PageLinks.CONTACTS && !cartModal.isOpen,
                    })}
                ></button>
                <button
                    onClick={handleProfileClick}
                    aria-label='PROFILE'
                    className={cn('mobile-menu__item icon-user-black transition', {
                        'is-active': router.asPath === PageLinks.PROFILE && !cartModal.isOpen,
                    })}
                ></button>
                <button
                    onClick={handleModalCartClick}
                    aria-label='CHECKOUT'
                    className={cn('mobile-menu__item icon-cart transition', {
                        'is-active': router.asPath === PageLinks.CHECKOUT || cartModal.isOpen,
                    })}
                >
                    {cart?.totalQuantity && cart?.totalQuantity > 0 ? (
                        <div className='mobile-menu__item-count d-flex block-center'>{cart.totalQuantity}</div>
                    ) : null}
                </button>
            </nav>
            {!cart.isEmpty && (
                <div className={styles.floatingCart}>
                    <CartIcon />
                </div>
            )}
        </>
    )
})

export { Header }
