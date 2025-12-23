import React, { FC, useEffect } from 'react'
import Head from 'next/head'
// import { Html, Head } from 'next/document'
import Router, { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import { useCurrentLocality, usePrevious, useStore } from '~/hooks'
import { PageLinks } from '~/constants/pageLinks'

import {
    CartModal,
    ContactsModal,
    BonusesModal,
    RestaurantSelectModal,
    LoginModal,
    BookingModal,
    TextModal,
    SuccessfullReserveModal,
    PromocodeModal,
    Toastify,
} from '~/components'
import { Footer } from '~/components/Footer/Footer'
import { Header } from '~/components/Header/Header'
import { RestaurantClosedModal } from '~/components/RestaurantSelectModal/RestaurantClosedModal'
// import { GoogleTagManager } from './GoogleTagManager'
import { Preloader } from './Preloader/Preloader'
import { TOrderStep } from '~/types/order'
import { TProduct } from '~/types/catalog'
import { ALERT_MESSAGE_COOKIE } from '~/constants/misc'
import { metrincaYa } from './metrica'

interface Props {
    classes?: {
        footer?: string
        main?: string
    }
    recommendedProducts: TProduct[]
    title?: string | null
    description?: string | null
    orderStep?: TOrderStep
}

const Layout: FC<Props> = observer(({ classes, children, description, orderStep, recommendedProducts, title }) => {
    const {
        bonusesModal,
        contactsModal,
        loginModal,
        bookingModal,
        textModal,
        promocodeModal,
        user,
        restaurantClosedModal,
        restaurantSelectModal,
        cartModal,
        successfullReserveModal,
    } = useStore()
    const router = useRouter()
    const locality = useCurrentLocality()

    useEffect(() => {
        const alertMessage = Cookies.get(ALERT_MESSAGE_COOKIE)

        if (alertMessage !== undefined) {
            toast.info(alertMessage)

            Cookies.remove(ALERT_MESSAGE_COOKIE)
        }
    }, [])

    // redirect when a user was unauthenticated
    const prevUser = usePrevious(user)
    useEffect(() => {
        if (prevUser !== user && user == null) {
            router.push(PageLinks.HOME)
        }
    }, [prevUser, user])

    const defaultTitle = 'ITLE Стейк кафе ' + locality?.seo_title || ''

    const onCloseLoginModal = () => {
        if (loginModal.reqirectUrl) {
            Router.push(loginModal.reqirectUrl)
        }
        loginModal.close()
    }

    return (
        <>
            <Head>
                <html lang='ru' />
                {/* <YMInitializer accounts={[44399665]} options={{ webvisor: true }} version='2' /> */}
                {(() => {
                    if (typeof document === 'undefined') return null
                    metrincaYa()
                })()}

                <title>{title ?? defaultTitle}</title>
                <link href='/favicon/favicon.ico' rel='icon' />
                {/* <link href='/favicon/favicon-16x16.png' rel='icon' sizes='16x16' type='image/png' />
                <link href='/favicon/favicon-32x32.png' rel='icon' sizes='32x32' type='image/png' />
                <link href='/favicon/favicon-48x48.png' rel='icon' sizes='48x48' type='image/png' />
                <link href='/favicon/favicon.svg' rel='icon' type='image/svg+xml' /> */}

                <meta content={description ?? defaultTitle} name='description' />
                <link href='/manifest.json' rel='manifest' />
                <link href='/manifest.json' rel='manifest' />
            </Head>
            <Preloader />
            {/* <GoogleTagManager /> */}
            <Toastify />
            <Header orderStep={orderStep} />
            <main className={classes?.main}>{children}</main>
            {/*<DeliveryInfoBlocks />

            {
                desktopBanners.length > 0 &&
                <Banner banners={ desktopBanners } />
            }*/}
            <Footer className={classes?.footer} />
            <CartModal onClose={cartModal.close} open={cartModal.isOpen} recommendedProducts={recommendedProducts} />
            <RestaurantSelectModal
                deliveryType={restaurantSelectModal.deliveryType}
                onClose={restaurantSelectModal.close}
                open={restaurantSelectModal.isOpen}
            />
            {loginModal.isOpen && (
                <LoginModal
                    mainMessage={loginModal.mainMessage}
                    onClose={onCloseLoginModal}
                    open
                    subMessage={loginModal.subMessage}
                />
            )}
            {bookingModal.isOpen && <BookingModal open onClose={bookingModal.close} />}
            {textModal.isOpen && <TextModal open onClose={textModal.close} />}
            {successfullReserveModal.isOpen && <SuccessfullReserveModal />}
            {promocodeModal.isOpen && (
                <PromocodeModal
                    onClose={promocodeModal.close}
                    open
                    promocode={promocodeModal.promocode}
                    setResult={(result) => promocodeModal.setResult(result)}
                />
            )}
            {bonusesModal.isOpen && (
                <BonusesModal
                    onClose={bonusesModal.close}
                    open
                    setResult={(result) => bonusesModal.setResult(result)}
                />
            )}
            <RestaurantClosedModal onClose={restaurantClosedModal.close} open={restaurantClosedModal.isOpen} />
            <ContactsModal onClose={contactsModal.close} open={contactsModal.isOpen} />
        </>
    )
})

export { Layout }
