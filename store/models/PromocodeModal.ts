import { types } from 'mobx-state-tree'

export const PromocodeModal = types
    .model('PromocodeModal', {
        isOpen: types.boolean,
        promocode: types.string,
        result: types.boolean,
    })
    .actions((self) => ({
        open(promocode: string) {
            self.isOpen = true
            self.result = false
            self.promocode = promocode
        },
        close() {
            self.isOpen = false
        },
        setResult(result = false) {
            self.result = result
        },
    }))
