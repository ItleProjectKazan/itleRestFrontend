import React from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import { observer } from 'mobx-react-lite'
import { Layout, Section } from '~/components'
import { getPagePreview } from '~/services/queries'
import { TPagePreview } from '~/types/pages/page'
import { TContact } from '~/types/pages/contacts'
import { normalizePhone } from '~/helpers'
import { getRecomendedProducts, getSeoTitle } from '~/services/queries'
import { TProduct } from '~/types/catalog'
import { RESTAURANT_COOKIE } from '~/constants/misc'
import { parseRestaurantCookie, getRestaurant } from '~/helpers'
import { TSeoTitle } from '~/types/misc'

interface IContacts {
    content_pages: TContact[]
    recommendedProducts: TProduct[]
    seoTitles: TSeoTitle
}

const Contacts: NextPage<IContacts> = observer(({ content_pages, recommendedProducts, seoTitles }) => {
    const title = seoTitles?.seo_title || 'ИТЛЕ-СТЕЙК КАФЕ | Контакты'
    const description = seoTitles?.seo_description || 'ИТЛЕ-СТЕЙК КАФЕ | Контакты'

    return (
        <Layout title={title} description={description} recommendedProducts={recommendedProducts}>
            <Section className='contacts-page d-flex flex-wrap' title='Контакты'>
                <div className='container'>
                    <h1 className='contacts-page__title section-title'>Контакты</h1>

                    {content_pages?.length ? (
                        <div className='contacts-list d-flex flex-wrap'>
                            {content_pages.map(({ id, main_title, phone_number, email, description, role, name }) => (
                                <div key={id} className='contacts-list__item d-flex'>
                                    <div className='contacts-list__item-inner d-flex flex-column items-start'>
                                        <h3 className='contacts-list__item-title'>{main_title}</h3>

                                        {name && role ? (
                                            <div className='contacts-list__item-info d-flex flex-wrap items-start'>
                                                {role}
                                                <span className='contacts-list__item-name'>{name}</span>
                                            </div>
                                        ) : null}
                                        {description ? (
                                            <div className='contacts-list__item-info d-flex flex-wrap items-start'>
                                                {description}
                                            </div>
                                        ) : null}
                                        {phone_number ? (
                                            <a
                                                aria-label='ИТЛЕ телефон'
                                                href={`tel:${normalizePhone(phone_number)}`}
                                                className='contacts-list__item-contact d-flex items-center'
                                            >
                                                <span className='icon-phone'></span>
                                                {phone_number}
                                            </a>
                                        ) : null}
                                        <a
                                            href={`mailto:${email}`}
                                            className='contacts-list__item-contact d-flex items-center'
                                        >
                                            <span className='icon-email'></span>
                                            {email}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>
            </Section>
        </Layout>
    )
})

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    try {
        const cookies = ctx.req.cookies as Record<string, string>
        const getPageAwait = await await getPagePreview<TPagePreview<TContact[]>, TContact[]>('contact')

        const cookieRestaurant =
            cookies[RESTAURANT_COOKIE] !== undefined ? parseRestaurantCookie(cookies[RESTAURANT_COOKIE]) : null
        const restaurant = await getRestaurant(Number(cookieRestaurant?.id))
        const recommendedProductsAwait = await getRecomendedProducts(cookies.cart_id, restaurant?.id)
        const getSeoTitleAwait = getSeoTitle('contacts')
        const [page, recommendedProducts, seoTitles] = await Promise.all([
            getPageAwait,
            recommendedProductsAwait,
            getSeoTitleAwait,
        ])

        return {
            props: {
                recommendedProducts,
                content_pages: page.content_pages,
                seoTitles,
            },
        }
    } catch (error: any) {
        console.error(error)
        return {
            notFound: true,
        }
    }
}

export default Contacts
