import React from 'react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { observer } from 'mobx-react-lite'
import { getRecomendedProducts } from '~/services/queries'
import { TProduct } from '~/types/catalog'
import { parseRestaurantCookie } from '~/helpers'
import { RESTAURANT_COOKIE } from '~/constants/misc'
import { Layout, Section } from '~/components'
import { PageLinks } from '~/constants/pageLinks'

const links = [
    {
        label: 'Политика в отношении обработки персональных данных',
        url: PageLinks.INFO_PRIVACY,
    },
    {
        label: 'Пользовательское соглашение сервиса по доставке готовой еды ',
        url: PageLinks.INFO_RULES,
    },
    {
        label: 'Согласие на  обработку персональных данных ',
        url: PageLinks.INFO_AGREEMENT,
    },
]

const title = 'Юридическая информация'

interface Props {
    recommendedProducts: TProduct[]
}

const Legal: NextPage<Props> = observer(({ recommendedProducts }) => {
    return (
        <Layout description={title} recommendedProducts={recommendedProducts} title={title}>
            <Section title='Юридическая информация'>
                <div className='text-content'>
                    <h1>Юридическая информация</h1>
                    <ul className='list'>
                        {links.map((link, index) => (
                            <li key={index}>
                                <a href={link.url} className="transition" rel='noopener noreferrer' target='_blank'>
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </Section>
        </Layout>
    )
})

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const cookies = ctx.req.cookies as Record<string, string>
    const restaurant =
        cookies[RESTAURANT_COOKIE] !== undefined ? parseRestaurantCookie(cookies[RESTAURANT_COOKIE]) : null

    let recommendedProducts: TProduct[] = []
    if (cookies.cart_id) {
        recommendedProducts = await getRecomendedProducts(cookies.cart_id, restaurant?.id)
    }

    return {
        props: {
            recommendedProducts,
        },
    }
}

export default Legal
