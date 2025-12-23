import { createContext } from 'react'

import { RootStoreModel } from '~/store/models/RootStore'

export const StoreContext = createContext({} as RootStoreModel)
export const StoreProvider = StoreContext.Provider
