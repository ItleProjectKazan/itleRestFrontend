import React, { FC } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import styles from './Section.module.scss'

import CaretLeft from '~/public/images/caret-left.svg'

interface Props {
    bordered?: boolean
    className?: string
    contrastBg?: boolean
    title?: string | null
    wrapperClass?: string
    breadcrumbs?: { title: string; link?: string }[]
}

export const Section: FC<Props> = ({
    bordered,
    children,
    className,
    contrastBg,
    title,
    // titleClass,
    wrapperClass,
    breadcrumbs,
}) => {
    // const beautyTitle = useMemo(() => {
    //     if (typeof title == 'undefined' || title == null) return null

    //     const parts = title.split(' ')
    //     if (parts.length == 1) {
    //         return title
    //     }

    //     const titleParts = [
    //         <span className='orange' key={0}>
    //             {parts[0]}
    //         </span>,
    //     ]
    //     parts.shift()
    //     for (let i = 0; i < parts.length; i++) {
    //         titleParts.push(<span key={i + 1}>{parts[i]}</span>)
    //     }

    //     return titleParts
    // }, [title])

    return (
        <div
            className={classNames(
                wrapperClass,
                contrastBg && styles.containerWrapContrast,
                bordered && styles.containerBordered,
            )}
        >
            <section className={classNames('container', styles.container, className)}>
                <div className='breadcrumbs'>
                    <Link href='/'>главная</Link>

                    {breadcrumbs ? (
                        <>
                            {breadcrumbs.map(({ title, link }) => (
                                <React.Fragment key={link}>
                                    <CaretLeft />
                                    {link ? <Link href={link}>{title}</Link> : <span>{title}</span>}
                                </React.Fragment>
                            ))}
                        </>
                    ) : (
                        <>
                            <CaretLeft />
                            <span>{title}</span>
                        </>
                    )}
                </div>

                {/* {title !== undefined && (
                    <div className='main-title'>
                        <h2>{beautyTitle}</h2>
                    </div>
                )} */}
                {children}
            </section>
        </div>
    )
}
