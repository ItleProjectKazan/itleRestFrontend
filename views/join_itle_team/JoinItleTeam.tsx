import React from 'react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { observer } from 'mobx-react-lite'
import Image from 'next/legacy/image'

import { ApiEndpoints } from '~/constants/apiEndpoints'

import { http } from '~/core/axios'

import { TPromo } from '~/types/misc'
import { TProduct } from '~/types/catalog'
import { parseRestaurantCookie } from '~/helpers'

import { RESTAURANT_COOKIE } from '~/constants/misc'

import { Layout, Section } from '~/components'

import TGBtn from '~/public/images/tgBtn.svg'
import Telegram from '~/public/images/social-media/telegram.svg'
import Whatsapp from '~/public/images/social-media/whatsapp.svg'

import styles from './JoinItleTeam.module.scss'

interface Props {
    promos: TPromo[]
    recommendedProducts: TProduct[]
}

const JoinItleTeam: NextPage<Props> = observer(({ promos, recommendedProducts }) => {
    return (
        <Layout description='Работа в ИTLE' recommendedProducts={recommendedProducts} title='Работа в ИTLE'>
            <Section title='Работа в ИTLE'>
                <div className={styles.introText}>
                    Приглашаем вас стать частью команды ИТLЕ.
                    <br />
                    Вы сможете расти и развиваться в Halal проекте.
                </div>
                <div className={styles.manBlock}>
                    <div className={styles.firstRow}>
                        <div className={styles.textBlock}>
                            Информацию о вакансиях компании
                            <br />
                            можете получить в нашем чат-боте <span>@itle_bot</span>
                        </div>
                        <a href='https://t.me/s/itle_bot' rel='noreferrer' target='_blank'>
                            <TGBtn />
                        </a>
                    </div>
                    <div className={styles.secondRow}>
                        <div className={styles.textBlock}>
                            Или свяжитесь с нами
                            <br />
                            по телефону <span>+7 927 457-45-72</span>
                        </div>
                        <div className={styles.links}>
                            <a href='https://t.me/s/itle_bot' rel='noreferrer' target='_blank'>
                                <Telegram />
                            </a>
                            {/* <a
                                href="https://t.me/s/itle_bot"
                                rel="noreferrer"
                                target="_blank"
                            >
                                <Whatsapp />
                            </a> */}
                        </div>
                    </div>
                    <div className={styles.manImage}>
                        <Image alt='' src='/images/man.png' width={'389'} height={'454'} />
                    </div>
                </div>
            </Section>
        </Layout>
    )
})

interface QueryParams extends ParsedUrlQuery {
    slug?: string
}

export const getServerSideProps: GetServerSideProps<Props, QueryParams> = async (ctx) => {
    const cookies = ctx.req.cookies as Record<string, string>
    const restaurant =
        cookies[RESTAURANT_COOKIE] !== undefined ? parseRestaurantCookie(cookies[RESTAURANT_COOKIE]) : null

    const [recommendedProducts] = await Promise.all([
        http.get<TProduct[]>(ApiEndpoints.CART_RECOMMENDED_PRODUCTS, {
            params: {
                cart_id: cookies.cart_id,
                restaurant_id: restaurant?.id,
            },
        }),
    ])

    try {
        const [promos] = await Promise.all([
            http.get<TPromo[][]>(ApiEndpoints.PROMOS_LIST, {
                params: {
                    content_type: 'promos',
                },
            }),
        ])

        return {
            props: {
                promos: promos.data[0],
                recommendedProducts: recommendedProducts.data,
            },
        }
    } catch (error: any) {
        return {
            notFound: true,
            recommendedProducts: recommendedProducts.data,
        }
    }
}

export default JoinItleTeam
