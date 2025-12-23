import React from 'react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import Image from 'next/legacy/image'

import { observer } from 'mobx-react-lite'

import { ApiEndpoints } from '~/constants/apiEndpoints'

import { http } from '~/core/axios'

import { TProduct } from '~/types/catalog'
import { parseRestaurantCookie } from '~/helpers'

import { RESTAURANT_COOKIE } from '~/constants/misc'

import { Button, Layout, Section } from '~/components'
import { PageLinks } from '~/constants/pageLinks'

import styles from './Bonuses.module.scss'

const title = 'Бонусная программа в ИТЛЕ-Бистро'

interface Props {
    recommendedProducts: TProduct[]
}

const Bonuses: NextPage<Props> = observer(({ recommendedProducts }) => {
    return (
        <Layout description={title} recommendedProducts={recommendedProducts} title={title}>
            <div className={styles.headerRow}>
                <Section className={styles.headerHolder}>
                    <div className={styles.textHolder}>
                        <div className={styles.mainText}>
                            Возвращаем 5% на заказы сделанные онлайн во всех наших брендах
                        </div>
                        <div className={styles.subText}>
                            Копите бонусы и оплачивайте ими свои
                            <br />
                            следующие онлайн-заказы
                        </div>
                    </div>
                    <div className={styles.dishHolder}>
                        <Image
                            alt=''
                            height='433'
                            // layout="responsive"
                            // objectFit="contain"
                            // objectPosition="top"
                            src='/images/bonuses/dish.png'
                            unoptimized
                            width='704'
                        />
                    </div>
                    <div className={styles.coinHolder}>
                        <Image
                            alt=''
                            height='117'
                            // layout="responsive"
                            // objectFit="contain"
                            // objectPosition="top"
                            src='/images/bonuses/coin.png'
                            unoptimized
                            width='99'
                        />
                    </div>
                </Section>
            </div>

            <div className={styles.logoList}>
                <div className={styles.logoHolder}>
                    <Image
                        alt=''
                        height='60'
                        // layout="responsive"
                        // objectFit="contain"
                        // objectPosition="top"
                        src='/images/bonuses/logo1.png'
                        unoptimized
                        width='231'
                    />
                </div>
                <div className={styles.logoHolder}>
                    <Image
                        alt=''
                        height='60'
                        // layout="responsive"
                        // objectFit="contain"
                        // objectPosition="top"
                        src='/images/bonuses/logo2.png'
                        unoptimized
                        width='209'
                    />
                </div>
                <div className={styles.logoHolder}>
                    <Image
                        alt=''
                        height='60'
                        // layout="responsive"
                        // objectFit="contain"
                        // objectPosition="top"
                        src='/images/bonuses/logo3.png'
                        unoptimized
                        width='209'
                    />
                </div>
            </div>

            <div className={styles.mainContent}>
                <Section>
                    <div className={styles.benefitRow}>
                        <div className={styles.benefitText}>
                            <div className={styles.benefitHeading}>Сделайте заказ онлайн</div>
                            <div className={styles.benefitSub}>На сайте или через приложение</div>
                        </div>
                        <div className={styles.benefitImage}>
                            <Image
                                alt=''
                                height='350'
                                // layout="responsive"
                                // objectFit="contain"
                                // objectPosition="top"
                                src='/images/bonuses/benefit1.png'
                                unoptimized
                                width='383'
                            />
                            <div className={styles.arrowRight}>
                                <Image
                                    alt=''
                                    height='272'
                                    // layout="responsive"
                                    // objectFit="contain"
                                    // objectPosition="top"
                                    src='/images/bonuses/arrow_right.png'
                                    unoptimized
                                    width='260'
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.benefitRow}>
                        <div className={styles.benefitText}>
                            <div className={styles.benefitHeading}>Получите кешбек 5%</div>
                            <div className={styles.benefitSub}>
                                Баланс можно посмотреть на сайте и<br />в приложении
                            </div>
                        </div>
                        <div className={styles.benefitImage}>
                            <Image
                                alt=''
                                height='371'
                                // layout="responsive"
                                // objectFit="contain"
                                // objectPosition="top"
                                src='/images/bonuses/benefit2.png'
                                unoptimized
                                width='354'
                            />
                            <div className={styles.arrowLeft}>
                                <Image
                                    alt=''
                                    height='256'
                                    // layout="responsive"
                                    // objectFit="contain"
                                    // objectPosition="top"
                                    src='/images/bonuses/arrow_left.png'
                                    unoptimized
                                    width='211'
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.benefitRow}>
                        <div className={styles.benefitText}>
                            <div className={styles.benefitHeading}>
                                Тратьте до 30% бонусов
                                <br />
                                на онлайн-заказы
                            </div>
                            <div className={styles.benefitSubRed}>1 бонус = 1 рублю</div>
                        </div>
                        <div className={styles.benefitImage}>
                            <Image
                                alt=''
                                height='403'
                                // layout="responsive"
                                // objectFit="contain"
                                // objectPosition="top"
                                src='/images/bonuses/benefit3.png'
                                unoptimized
                                width='530'
                            />
                        </div>
                    </div>

                    <div className={styles.afterAttention}>
                        <div className={styles.imgHolder}>
                            <Image
                                alt=''
                                height='56'
                                // layout="responsive"
                                // objectFit="contain"
                                // objectPosition="top"
                                src='/images/bonuses/attention.png'
                                unoptimized
                                width='48'
                            />
                        </div>
                        <span>Нельзя использовать с промокодами</span>
                    </div>

                    <div className={styles.toMenuButtonHolder}>
                        <Button className={styles.toMenuButton} href={PageLinks.HOME}>
                            Перейти в меню
                        </Button>
                    </div>

                    <div className={styles.finalText}>
                        Общая программа лояльности работает для трех брендов ITLE : «Стейк-кафе», «Бистро» и «Китчен».
                        Бонусы обнулятся, если Вы не будете делать заказы 3 месяца, но мы обязательно Вас предупредим за
                        пару недель до этого.
                    </div>
                </Section>
            </div>
        </Layout>
    )
})

export const getServerSideProps: GetServerSideProps = async (ctx) => {
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

    return {
        props: {
            recommendedProducts: recommendedProducts.data,
        },
    }
}

export default Bonuses
