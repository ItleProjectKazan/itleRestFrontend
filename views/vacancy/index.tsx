import React, { useEffect, useState } from 'react'
import { NextPage, GetServerSideProps } from 'next'
import { useQuery } from 'react-query'
import { QUERY_KEYS } from '~/views/home/constants'
import { Layout, Section, Loader } from '~/components'
import Pagination from '~/components/Pagination'
import VacancyBlock from './VacancyBlock'
import { getVacancies } from '~/services/queries'
import { TVacancy } from '~/types/vacancy'
import { RESTAURANT_COOKIE } from '~/constants/misc'
import { getRecomendedProducts, getSeoTitle } from '~/services/queries'
import { parseRestaurantCookie, getRestaurant } from '~/helpers'
import { TProduct } from '~/types/catalog'
import { TSeoTitle } from '~/types/misc'

interface IVacancy {
    recommendedProducts: TProduct[]
    seoTitles: TSeoTitle
}

const Vacancy: NextPage<IVacancy> = ({ recommendedProducts = [], seoTitles }: IVacancy) => {
    const title = seoTitles?.seo_title || 'ИТЛЕ-СТЕЙК КАФЕ | Вакансии'
    const description = seoTitles?.seo_description || 'ИТЛЕ-СТЕЙК КАФЕ | Вакансии'

    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [pagesCount, setPagesCount] = useState(0)
    const limit = 4
    const offset = (page - 1) * limit
    const pageClick = (page: number) => {
        setPage(page)
        setLoading(true)
    }

    const vacancy = useQuery(QUERY_KEYS.VACANCY(limit, offset), () => getVacancies(limit, offset), {
        refetchOnWindowFocus: false,
    })

    useEffect(() => {
        if (vacancy?.data?.vacancy) {
            const pCount = Math.ceil(vacancy.data.count / limit)
            setPagesCount(pCount)
            setLoading(false)
        }
    }, [vacancy])

    return (
        <Layout title={title} description={description} recommendedProducts={recommendedProducts}>
            <Section className='vacancy-page d-flex flex-wrap' title='Вакансии '>
                <div className='container'>
                    <h1 className='vacancy-page__title section-title'>Вакансии</h1>
                    <div className='vacancy-list d-flex flex-wrap'>
                        {loading ? (
                            <div className='main-banner__slide loading'>
                                <Loader />
                            </div>
                        ) : (
                            vacancy?.data?.vacancy?.length &&
                            vacancy?.data?.vacancy.map(
                                ({
                                    id,
                                    name,
                                    restaurant: { address },
                                    responsibilities_md,
                                    salary,
                                    experience_from,
                                    experience_to,
                                    employment: { name: employmentName },
                                    schedule: { name: scheduleName },
                                }: TVacancy) => (
                                    <VacancyBlock
                                        key={id}
                                        vacancyId={id}
                                        vacancyName={name}
                                        address={address}
                                        responsibilities={responsibilities_md}
                                        salary={salary}
                                        experience_from={experience_from}
                                        experience_to={experience_to}
                                        employmentName={employmentName}
                                        scheduleName={scheduleName}
                                    />
                                ),
                            )
                        )}
                        <Pagination pagesCount={pagesCount} currentPage={page} pageClick={pageClick} />
                    </div>
                </div>
            </Section>
        </Layout>
    )
}
export default Vacancy

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    try {
        const cookies = ctx.req.cookies as Record<string, string>

        const cookieRestaurant =
            cookies[RESTAURANT_COOKIE] !== undefined ? parseRestaurantCookie(cookies[RESTAURANT_COOKIE]) : null
        const restaurant = await getRestaurant(Number(cookieRestaurant?.id))
        const recommendedProductsAwait = getRecomendedProducts(cookies?.cart_id, restaurant?.id)
        const getSeoTitleAwait = getSeoTitle('vacancy')
        const [recommendedProducts, seoTitles] = await Promise.all([recommendedProductsAwait, getSeoTitleAwait])

        return {
            props: {
                recommendedProducts,
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
