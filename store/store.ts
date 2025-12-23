import { createStore, StoreInitialData } from '~/store/createStore'

import { RootStoreModel } from './models/RootStore'

let store: RootStoreModel | undefined

export const initializeStore = (data: StoreInitialData) => {
    // for SSR create a new store on each call
    if (typeof window === 'undefined') {
        return createStore(data)
    }

    // for browser use store created before
    if (store === undefined) {
        store = createStore(data)
    }

    return store
}
