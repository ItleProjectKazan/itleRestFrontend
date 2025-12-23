import { types } from 'mobx-state-tree'

export const ContactsModal = types
    .model('ContactsModal', {
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
