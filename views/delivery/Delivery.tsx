import { GetServerSideProps } from 'next'
import type { NextPage } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { observer } from 'mobx-react-lite'
import { ApiEndpoints } from '~/constants/apiEndpoints'
import { http } from '~/core/axios'
import { TPromo } from '~/types/misc'
import { TProduct } from '~/types/catalog'
import { parseRestaurantCookie } from '~/helpers'
import { RESTAURANT_COOKIE } from '~/constants/misc'
import { Layout, Section } from '~/components'

interface Props {
    promos: TPromo[]
    recommendedProducts: TProduct[]
}

const Delivery: NextPage<Props> = observer(({ recommendedProducts }) => {
    return (
        <Layout description='Доставка и оплата' recommendedProducts={recommendedProducts} title='Доставка и оплата'>
            <Section title='Доставка и оплата'>
                <h1 className='address-page__title section-title'>Доставка и оплата</h1>
                <div className='delivery-payment d-flex flex-wrap'>
                    <div className='delivery-payment__item d-flex'>
                        <div className='delivery-payment__item-inner d-flex flex-column'>
                            <span className='delivery-payment__item-icon icon-lunch-box'></span>
                            <h2 className='delivery-payment__item-title'>
                                Самовывоз <br />
                                заказ <br />
                                из ресторанов
                            </h2>
                            <p className='delivery-payment__item-text'>Две точки самовывоза:</p>
                            <span className='delivery-payment__item-address'>Казань, Меридианная, дом 1</span>
                            <span className='delivery-payment__item-address'>Казань, Спартаковская, дом 6</span>
                        </div>
                    </div>
                    <div className='delivery-payment__item d-flex'>
                        <div className='delivery-payment__item-inner d-flex flex-column'>
                            <span className='delivery-payment__item-icon icon-car'></span>
                            <h2 className='delivery-payment__item-title'>
                                Доставка <br />
                                вашего <br />
                                заказа
                            </h2>
                            <p className='delivery-payment__item-text'>
                                Мы доставим ваш заказ, при сумме заказа от 700 ₽.
                                <br />
                                Бесплатная доставка заказа при сумме от 1500 ₽
                            </p>
                        </div>
                    </div>
                    <div className='delivery-payment__item d-flex'>
                        <div className='delivery-payment__item-inner d-flex flex-column'>
                            <span className='delivery-payment__item-icon icon-credit-card'></span>
                            <h2 className='delivery-payment__item-title'>
                                Оплата <br />
                                банковской <br />
                                картой
                            </h2>
                            <p className='delivery-payment__item-text'>
                                Онлайн оплата на сайте при оформлении заказа. Можно выбрать несколько вариантов оплаты:
                                Visa, Mastercard, Мир
                            </p>
                        </div>
                    </div>
                    <div className='delivery-payment__item d-flex'>
                        <div className='delivery-payment__item-inner d-flex flex-column'>
                            <span className='delivery-payment__item-icon icon-payment-method'></span>
                            <h2 className='delivery-payment__item-title'>
                                можете <br />
                                Оплатить при <br />
                                получении
                            </h2>
                            <p className='delivery-payment__item-text'>
                                Оплата картой или наличными курьеру при получении заказа.
                                <br />
                                Будет необходимо подготовить всю сумму без сдачи
                            </p>
                        </div>
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
        console.error(error)
        return {
            notFound: true,
            recommendedProducts: recommendedProducts.data,
        }
    }
}

export default Delivery
