import { useMemo } from 'react'
import type { AppContext, AppProps } from 'next/app'
import { dehydrate, DehydratedState, Hydrate, QueryClient, QueryClientProvider } from 'react-query'
// import { removeCookies } from 'cookies-next'

import { http } from '~/core/axios'
import { setAuthToken, setRequestHeaders } from '~/core/auth'
import { fetchUser, findLocalityByRestaurant, parseRestaurantCookie } from '~/helpers'
import { initializeStore } from '~/store/store'
import { StoreProvider } from '~/store/StoreProvider'

import { TEnvironment, TLocality, TOrderParams, TUser } from '~/types/misc'
import { TOrderType } from '~/types/order'
import { CartService, TCartResponse } from '~/services/cart'

import { ORDER_TYPE_COOKIE, RESTAURANT_COOKIE, DELIVERY_ZONE_ID } from '~/constants/misc'
import { ApiEndpoints } from '~/constants/apiEndpoints'
import { fetchCart, CART_QUERY_KEY } from '~/hooks/useCart'

import '../styles/globals.scss'
import { SheduleInfoModalProvider } from '~/context/SheduleInfoModal/SheduleInfoModalProvider'

interface Props extends AppProps {
    dehydratedState: DehydratedState
    environment: TEnvironment
    localities: TLocality[]
    orderParams: any
    user: TUser | null
}

function App({ dehydratedState, Component, environment, localities, orderParams, pageProps, user }: Props) {
    const store = initializeStore({
        environment,
        localities,
        orderParams,
        user,
    })

    const mergedDehydratedState: DehydratedState = {
        mutations: [...dehydratedState.mutations, ...(pageProps?.dehydratedState?.mutations ?? [])],
        queries: [...dehydratedState.queries, ...(pageProps?.dehydratedState?.queries ?? [])],
    }

    // warning: creation of query client inside the component is required
    // to prevent data sharing data between users
    // see: https://react-query.tanstack.com/guides/ssr
    const queryClient = useMemo(() => new QueryClient(), [])

    return (
        <StoreProvider value={store}>
            <SheduleInfoModalProvider>
                <QueryClientProvider client={queryClient}>
                    <Hydrate state={mergedDehydratedState}>
                        <Component {...pageProps} />
                    </Hydrate>
                </QueryClientProvider>
            </SheduleInfoModalProvider>
        </StoreProvider>
    )
}

type ApiProps = Omit<Props, keyof AppProps>

App.getInitialProps = async (ctx: AppContext): Promise<ApiProps> => {
    const request = ctx.ctx.req
    // @ts-ignore
    const cookies = (request?.cookies ?? {}) as Record<string, string>

    setRequestHeaders((request?.headers ?? {}) as any)
    setAuthToken(cookies.token)

    const [environment, localities] = await Promise.all([
        http.get<TEnvironment>(ApiEndpoints.ENVIRONMENT),
        http.get<TLocality[]>(ApiEndpoints.RESTAURANTS),
    ])

    const user = await fetchUser()

    CartService.setId(cookies.cart_id ?? null)

    const queryClient = new QueryClient()

    await queryClient.prefetchQuery(CART_QUERY_KEY, fetchCart)

    const cart = (
        await queryClient.fetchQuery<TCartResponse>(CART_QUERY_KEY, fetchCart, {
            // use cached data if it cached less than 5 seconds ago
            staleTime: 5000,
        })
    ).cart

    const dehydratedState = dehydrate(queryClient)

    const cookieOrderType = cookies[ORDER_TYPE_COOKIE] !== undefined ? cookies[ORDER_TYPE_COOKIE] : null
    const deliveryZoneId = cookies[DELIVERY_ZONE_ID] !== undefined ? Number(cookies[DELIVERY_ZONE_ID]) : null

    const cookieRestaurant =
        cookies[RESTAURANT_COOKIE] !== undefined ? parseRestaurantCookie(cookies[RESTAURANT_COOKIE]) : null

    // order type and location specified in order have higher priority
    let orderType = cart !== null ? cart.order_type : (cookieOrderType ?? TOrderType.DELIVERY)
    const restaurantId = cart !== null ? cart.restaurant_id : (cookieRestaurant?.id ?? null)

    const localityId =
        restaurantId !== null ? (findLocalityByRestaurant(localities.data, restaurantId)?.id ?? null) : null

    if (![TOrderType.DELIVERY, TOrderType.PICKUP].includes(orderType as any)) {
        orderType = TOrderType.DELIVERY

        // removeCookies(ORDER_TYPE_COOKIE, {
        //     req: ctx.ctx.req,
        //     res: ctx.ctx.res,
        // })
    }
    const orderParams: Partial<TOrderParams> = {
        deliveryDetails: cookieRestaurant?.delivery_details ?? null,
        orderType,
        localityId,
        restaurantId,
        deliveryZoneId,
    }

    return {
        dehydratedState,
        environment: environment.data,
        localities: localities.data,
        orderParams,
        user,
    }
}

export default App
