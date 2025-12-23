import React, { useEffect, useMemo, useState } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { Layout, Section } from '~/components'
import { getPage } from '~/services/queries'
import { TPage } from '~/types/pages/page'
import { TNewsCard } from '~/types/pages/news'
import FirstBlock from './FirstBlock'
import EventBlock from './EventBlock'
import NewsPageAside from './NewsPageAside'
import { Loader } from '~/components'
import { getRecomendedProducts } from '~/services/queries'
import { TProduct } from '~/types/catalog'
import { PageLinks } from '~/constants/pageLinks'
import Social from './Social'
import { RESTAURANT_COOKIE } from '~/constants/misc'
import { parseRestaurantCookie } from '~/helpers'
import { getRestaurant } from '~/helpers'

interface IEventCard {
    content_page: TNewsCard
    recommendedProducts: TProduct[]
}

const Event: NextPage<IEventCard> = ({ content_page, recommendedProducts }: IEventCard) => {
    const [loading, setLoading] = useState(true)
    const title = content_page?.seo_title || content_page?.first?.main_title || 'ИТЛЕ-СТЕЙК КАФЕ | Новости| События'
    const description =
        content_page?.seo_description || content_page?.first?.main_title || 'ИТЛЕ-СТЕЙК КАФЕ | Новости | События'

    useEffect(() => {
        setLoading(false)
    }, [])

    const breadcrumbs = useMemo(
        () => [
            {
                title: 'События',
                link: PageLinks.NEWS,
            },
            { title: content_page?.first?.main_title || '' },
        ],
        [content_page?.first?.main_title],
    )

    return (
        <Layout title={title} description={description} recommendedProducts={recommendedProducts}>
            <Section className='event-page d-flex flex-wrap' breadcrumbs={breadcrumbs}>
                <div className='container d-flex flex-wrap'>
                    {loading ? (
                        <div className='main-banner__slide loading'>
                            <Loader />
                        </div>
                    ) : (
                        <div className='event-page__content d-flex flex-wrap'>
                            <FirstBlock
                                title={content_page?.first?.main_title || ''}
                                description={content_page?.first?.title || ''}
                                date={content_page?.date || content_page?.updated_at || ''}
                            />
                            <EventBlock block={content_page.second} />
                            <EventBlock block={content_page.third} />
                            <EventBlock block={content_page.fourth} />
                            <EventBlock block={content_page.fifth} />
                            <EventBlock block={content_page.sixth} />
                            <EventBlock block={content_page.seventh} />
                            <EventBlock block={content_page.text} />
                            {/* <Social url={'https://itle.pro/'} text={content_page?.first?.title || ''} /> */}
                        </div>
                    )}
                    <NewsPageAside />
                </div>
            </Section>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const cookies = ctx.req.cookies as Record<string, string>
    const id = ctx.query.id
    try {
        const { content_page } = await getPage<TPage<TNewsCard>, TNewsCard>('event', Number(id))
        const cookieRestaurant =
            cookies[RESTAURANT_COOKIE] !== undefined ? parseRestaurantCookie(cookies[RESTAURANT_COOKIE]) : null
        const restaurant = await getRestaurant(Number(cookieRestaurant?.id))
        const recommendedProducts = await getRecomendedProducts(cookies?.cart_id, restaurant?.id)

        return {
            props: {
                content_page,
                recommendedProducts,
            },
        }
    } catch (error: any) {
        console.error(error)
        return {
            notFound: true,
        }
    }
}

export default Event
