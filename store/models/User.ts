import { getParent, Instance, types } from 'mobx-state-tree'
import cookie from 'cookie'
import { http } from '~/core/axios'
import { setAuthToken } from '~/core/auth'
import Router from 'next/router'
import { PageLinks } from '~/constants/pageLinks'
import { RootStoreModel } from '~/store/models/RootStore'
import { ApiEndpoints } from '~/constants/apiEndpoints'

export type TUser = Instance<typeof User>

export const User = types
    .model('User', {
        id: types.number,
        email: types.maybeNull(types.string),
        name: types.maybeNull(types.string),
        birthday: types.maybeNull(types.string),
        phone_number: types.string,
        bonus_count: types.maybeNull(types.number),
        bonus_expiration_date: types.maybeNull(types.string),
    })
    .actions((self) => ({
        async logOut() {
            if (Router.route !== PageLinks.ROUTER_HOME_DEFAULT) {
                Router.push(PageLinks.HOME)
            }
            await http.post(ApiEndpoints.LOG_OUT)
            setAuthToken(undefined)
            // remove token cookie
            if (cookie) {
                document['cookie'] = cookie.serialize('token', '', {
                    path: '/',
                    sameSite: 'lax',
                    expires: new Date(),
                })
            }
            getParent<RootStoreModel>(self).clearUser()
        },
    }))
