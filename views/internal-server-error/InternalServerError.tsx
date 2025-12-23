import React from 'react'
import type { NextPage } from 'next'
import Image from 'next/legacy/image'

import { Button, Layout, Typography } from '~/components'

import styles from './InternalServerError.module.scss'

const InternalServerError: NextPage = () => {
    const title = '500 - Ошибка на сервере'

    return (
        <Layout description={title} recommendedProducts={[]} title={title}>
            <div className='container'>
                <div className={styles.root}>
                    <div className={styles.text}>
                        <Typography element='h2' lineHeight={44} size={36}>
                            Внутрення ошибка сервера
                        </Typography>
                        <Typography className='mt-20' weight='normal'>
                            При выполнении запроса произошла ошибка.
                        </Typography>
                        <Button className='mt-16' href='/'>
                            Перейти в меню
                        </Button>
                    </div>
                    <Image alt='' className={styles.image} height={412} src='/images/404.svg' width={448} />
                </div>
            </div>
        </Layout>
    )
}

export default InternalServerError
