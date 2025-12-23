import { cast, types } from 'mobx-state-tree'

export const AddProductQuery = types
    .model('AddProductQuery', {
        product: types.maybeNull(types.number),
        modifiers: types.maybeNull(types.array(types.number)),
    })
    .actions(self => ({
        add(product: number, modifiers: number[]) {
            self.product = product
            self.modifiers = cast(modifiers)
        },
        clear() {
            self.product = null
            self.modifiers = null
        },
    }))
