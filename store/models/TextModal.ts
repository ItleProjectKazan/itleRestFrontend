import { types } from 'mobx-state-tree'

export const TextModal = types
    .model('TextModal', {
        isOpen: types.boolean,
        title: types.string,
        text: types.string,
    })
    .actions((self) => ({
        open(title = '', text = '') {
            self.isOpen = true
            self.title = title
            self.text = text
        },
        close() {
            self.isOpen = false
        },
    }))
