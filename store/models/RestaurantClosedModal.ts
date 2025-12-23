import { types } from 'mobx-state-tree'

export const RestaurantClosedModal = types
    .model('RestaurantClosedModal', {
        isOpen: types.boolean,
    })
    .actions(self => ({
        open() {
            self.isOpen = true
        },
        close() {
            self.isOpen = false
        },
    }))
