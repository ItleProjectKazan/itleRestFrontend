import { types } from 'mobx-state-tree'

export const LoginModal = types
    .model('LoginModal', {
        mainMessage: types.string,
        subMessage: types.string,
        isOpen: types.boolean,
        reqirectUrl: types.string,
    })
    .actions((self) => ({
        open(mainMessage: string, subMessage: string, reqirectUrl = '') {
            self.mainMessage = mainMessage
            self.subMessage = subMessage
            self.reqirectUrl = reqirectUrl
            self.isOpen = true
        },
        close() {
            self.isOpen = false
            self.reqirectUrl = ''
        },
    }))
