import { http } from '~/core/axios'

import { ApiEndpoints } from '~/constants/apiEndpoints'
import { TUpdateUserRequest } from '~/services/userService/types'

export const UserService = {
    updateProfile: (parameters: TUpdateUserRequest) => {
        return http.post(ApiEndpoints.UPDATE_PROFILE, parameters)
    },
}
