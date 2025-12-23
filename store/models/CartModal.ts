import { types } from 'mobx-state-tree'

export const CartModal = types
    .model('CartModal', {
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
