import { AddProductQuery } from './models/AddProductQuery'
import { Environment } from './models/Environment'
import { RestaurantClosedModal } from '~/store/models/RestaurantClosedModal'
import { RestaurantSelectModal } from '~/store/models/RestaurantSelectModal'
import { CartModal } from '~/store/models/CartModal'
import { LoginModal } from './models/LoginModal'
import { BookingModal } from './models/BookingModal'
import { TextModal } from './models/TextModal'
import { ContactsModal } from './models/ContactsModal'
import { PromocodeModal } from './models/PromocodeModal'
import { BonusesModal } from './models/BonusesModal'
import { SuccessfullReserveModal } from './models/SuccessfullReserveModal'
import { OrderParams } from './models/OrderParams'
import { RootStore, RootStoreModel } from './models/RootStore'
import { User } from '~/store/models/User'

import { TEnvironment, TLocality, TUser } from '~/types/misc'
import { TPaymentMethod } from '~/types/order'

export type StoreInitialData = {
    environment: TEnvironment
    localities: TLocality[]
    orderParams: any
    user: TUser | null
}

export const createStore = ({
    environment: environmentData,
    localities,
    orderParams: orderParamsData,
    user: userData,
}: StoreInitialData): RootStoreModel => {
    const environment = Environment.create(environmentData)
    const restaurantClosedModal = RestaurantClosedModal.create({
        isOpen: false,
    })
    const addProductQuery = AddProductQuery.create({
        product: null,
    })
    const restaurantSelectModal = RestaurantSelectModal.create({
        deliveryType: '',
        isOpen: false,
    })
    const cartModal = CartModal.create({
        isOpen: false,
    })
    const loginModal = LoginModal.create({
        isOpen: false,
        mainMessage: '',
        subMessage: '',
        reqirectUrl: '',
    })
    const bookingModal = BookingModal.create({
        isOpen: false,
    })
    const textModal = TextModal.create({
        isOpen: false,
        title: '',
        text: '',
    })
    const contactsModal = ContactsModal.create({
        isOpen: false,
    })
    const promocodeModal = PromocodeModal.create({
        isOpen: false,
        promocode: '',
        result: true,
    })
    const bonusesModal = BonusesModal.create({
        isOpen: false,
        result: true,
    })
    const successfullReserveModal = SuccessfullReserveModal.create({
        isOpen: false,
    })
    const orderParams = OrderParams.create({
        ...orderParamsData,
        paymentMethod: TPaymentMethod.CARD_ONLINE,
    })

    const user = userData !== null && userData !== undefined ? User.create(userData) : null

    return RootStore.create(
        {
            addProductQuery,
            environment,
            localities,
            restaurantClosedModal,
            restaurantSelectModal,
            cartModal,
            loginModal,
            contactsModal,
            bonusesModal,
            orderParams,
            promocodeModal,
            successfullReserveModal,
            user,
            bookingModal,
            textModal,
        },
        {
            environment,
            localities,
        },
    )
}
