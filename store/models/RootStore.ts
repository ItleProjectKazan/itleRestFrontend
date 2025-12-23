/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Instance, types } from 'mobx-state-tree'
import { http } from '~/core/axios'
import { AddProductQuery } from './AddProductQuery'
import { Environment } from './Environment'
import { Locality } from './Locality'
import { RestaurantClosedModal } from './RestaurantClosedModal'
import { RestaurantSelectModal } from 'store/models/RestaurantSelectModal'
import { CartModal } from 'store/models/CartModal'
import { LoginModal } from './LoginModal'
import { BookingModal } from './BookingModal'
import { TextModal } from './TextModal'
import { ContactsModal } from './ContactsModal'
import { PromocodeModal } from './PromocodeModal'
import { BonusesModal } from './BonusesModal'
import { SuccessfullReserveModal } from './SuccessfullReserveModal'
import { OrderParams } from './OrderParams'
import { TUser, User } from './User'
import { ApiEndpoints } from '~/constants/apiEndpoints'

export type RootStoreModel = Instance<typeof RootStore>

export const RootStore = types
    .model('RootStore', {
        addProductQuery: AddProductQuery,
        cartModal: CartModal,
        environment: Environment,
        localities: types.array(Locality),
        restaurantSelectModal: RestaurantSelectModal,
        bookingModal: BookingModal,
        textModal: TextModal,
        loginModal: LoginModal,
        contactsModal: ContactsModal,
        bonusesModal: BonusesModal,
        promocodeModal: PromocodeModal,
        successfullReserveModal: SuccessfullReserveModal,
        orderParams: OrderParams,
        restaurantClosedModal: RestaurantClosedModal,
        user: types.maybeNull(User),
    })
    .actions((self) => ({
        async fetchUser() {
            const user = (await http.get<TUser>(ApiEndpoints.PROFILE)).data
            // @ts-ignore
            self.setUser(user)
        },
        setUser(user: TUser) {
            self.user = user
        },
        clearUser() {
            self.user = null
        },
    }))
