import { types } from 'mobx-state-tree'

export const BonusesModal = types
    .model('BonusesModal', {
        isOpen: types.boolean,
        result: types.boolean,
    })
    .actions((self) => ({
        open() {
            self.isOpen = true
            self.result = true
        },
        close() {
            self.isOpen = false
        },
        setResult(result: boolean) {
            self.result = result
        },
    }))
