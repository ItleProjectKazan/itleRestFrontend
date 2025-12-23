import { types } from 'mobx-state-tree'

export const SuccessfullReserveModal = types
    .model('SuccessfullReserveModal', {
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
