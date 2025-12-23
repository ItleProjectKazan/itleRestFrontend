import React from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import { observer } from 'mobx-react-lite'
import { getRecomendedProducts } from '~/services/queries'
import { PageLinks } from '~/constants/pageLinks'
import { fetchUser } from '~/helpers'
import { Layout } from '~/components'
import ProfileEdit from './ProfileEdit/ProfileEdit'
import ProfileIntro from './ProfileIntro/ProfileIntro'
import { useStore } from '~/hooks'
import ProfileOrder from './ProfileOrder'
import { TProduct } from '~/types/catalog'
import { RESTAURANT_COOKIE } from '~/constants/misc'
import { parseRestaurantCookie } from '~/helpers'
import { getRestaurant } from '~/helpers'

interface IProfile {
    recommendedProducts: TProduct[]
}

const Profile: NextPage<IProfile> = observer(({ recommendedProducts = [] }: IProfile) => {
    const { user } = useStore()
    const title = 'Личный кабинет'

    return (
        <Layout description={title} recommendedProducts={recommendedProducts} title={title}>
            <div className='profile-page'>
                <div className='container'>
                    <div className='profile-page__inner d-flex flex-wrap items-start'>
                        <h1 className='profile-page__title'>Личный кабинет</h1>
                        <ProfileOrder />
                        <div className='profile-page__info d-flex flex-wrap'>
                            <h2 className='profile-page__subtitle'>Профиль</h2>
                            <ProfileIntro />
                            <ProfileEdit />
                            <button
                                className='profile-page__info-btn d-flex items-center transition'
                                onClick={user?.logOut}
                            >
                                Выйти из профиля
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
})

const redirectToIndex = {
    redirect: {
        destination: PageLinks.HOME,
        permanent: false,
    },
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    try {
        const cookies = ctx.req.cookies as Record<string, string>
        const user = await fetchUser()

        if (user === null) {
            return redirectToIndex
        }

        const cookieRestaurant =
            cookies[RESTAURANT_COOKIE] !== undefined ? parseRestaurantCookie(cookies[RESTAURANT_COOKIE]) : null
        const restaurant = await getRestaurant(Number(cookieRestaurant?.id))
        const recommendedProducts = await getRecomendedProducts(cookies?.cart_id, restaurant?.id)

        return {
            props: {
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

export default Profile
