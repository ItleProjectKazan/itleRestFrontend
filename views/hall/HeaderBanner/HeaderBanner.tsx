import React from 'react'
import Link from 'next/link'

import styles from './HeaderBanner.module.scss'
import { Button } from '~/components'

import CaretLeft from '~/public/images/caret-left.svg'

const HeaderBanner = () => {

    const scrollToBron = () => {
        if (document == null) return
        const newLocal = document.getElementById("reserve_section")
        newLocal?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }

    return (
        <div className={styles.container}>
            <div className={styles.bannerBlock}>
                <div className={styles.breadcrumbs}>
                    <Link href="/">главная</Link>
                    <CaretLeft />
                    <span> банкетный зал</span>
                </div>
                <div className={styles.bannerIntro}>
                    Уютный банкетный<br />зал для вашего<br />торжества
                </div>
                <Button onClick={() => scrollToBron()} size="xlarge" className={styles.btn}>
                    Забронировать зал
                </Button>
            </div>
        </div >
    )
}

export { HeaderBanner }
