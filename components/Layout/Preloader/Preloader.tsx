import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Loader } from '~/components'

import Logo from '~/public/images/logo-bistro.svg'

import styles from './Preloader.module.scss'

export const Preloader = () => {
    const router = useRouter()

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const handleStart = (url: string) => (url.split('?')[0] !== router.asPath.split('?')[0]) && setLoading(true)
        const handleComplete = () => loading && setLoading(false)

        router.events.on('routeChangeStart', handleStart)
        router.events.on('routeChangeComplete', handleComplete)
        router.events.on('routeChangeError', handleComplete)

        return () => {
            router.events.off('routeChangeStart', handleStart)
            router.events.off('routeChangeComplete', handleComplete)
            router.events.off('routeChangeError', handleComplete)
        }
    })

    return (
        loading ?
            <div className={ styles.preloaderBlock }>
                <Logo height={ 48 } />
                <div className={ styles.dotsHolder }>
                    <Loader />
                </div>
            </div>
            :
            <div />
    )
}