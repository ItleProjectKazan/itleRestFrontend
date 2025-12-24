import React, { FC, useState, useEffect } from 'react'
import { getAppLink } from '~/constants/appLinks'
import { AppQRModal } from '~/components/AppQRModal'
import styles from './AppBanner.module.scss'
import CloseIcon from '~/public/images/close-icon.svg'

export const AppBanner: FC = () => {
    const [isVisible, setIsVisible] = useState(true)
    const [qrModalOpen, setQrModalOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        if (isVisible) {
            document.body.classList.add('app-banner-visible')
        } else {
            document.body.classList.remove('app-banner-visible')
        }
        return () => {
            document.body.classList.remove('app-banner-visible')
        }
    }, [isVisible])

    if (!isVisible) {
        return null
    }

    const handleClick = () => {
        if (isMobile) {
            window.location.href = getAppLink()
        } else {
            setQrModalOpen(true)
        }
    }

    const handleClose = () => {
        setIsVisible(false)
    }

    return (
        <>
            <div className={styles.bannerWrapper}>
                <div className="container" style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 15px' }}>
                    <div className={styles.banner}>
                        <div className={styles.logoBox}>
                            <img src="/images/app-logo.png" alt="ITLE" className={styles.logo} />
                        </div>
                        <div className={styles.textBlock}>
                            <div className={styles.title}>
                                СКАЧИВАЙТЕ{isMobile && <br />} ПРИЛОЖЕНИЕ <span className={styles.titleRed}>ITLE</span>
                            </div>
                            <div className={styles.subtitle} suppressHydrationWarning>
                              {isMobile
                                ? ''
                                : 'Ещё больше индивидуальных акций, скидок и промокодов в нашем приложении.'
                              }
                            </div>
                        </div>
                      <div className={styles.subtitle} suppressHydrationWarning>
                        {isMobile
                          ? 'Индивидуальные акции, скидки и промокоды в приложении.'
                          : ''
                        }
                      </div>
                        <button className={styles.button} onClick={handleClick}>
                            Скачать приложение ITLE
                        </button>
                        <button className={styles.closeButton} onClick={handleClose} aria-label="Закрыть">
                            <CloseIcon />
                        </button>
                    </div>
                </div>
            </div>
            <AppQRModal open={qrModalOpen} onClose={() => setQrModalOpen(false)} />
        </>
    )
}
