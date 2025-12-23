import { types } from 'mobx-state-tree'

export const BookingModal = types
    .model('BookingModal', {
        isOpen: types.boolean,
        restorauntId: types.maybe(types.number),
    })
    .actions((self) => ({
        open(restorauntId?: number) {
            if (restorauntId) {
                self.restorauntId = restorauntId
            }
            self.isOpen = true
        },
        close() {
            self.isOpen = false
        },
    }))
