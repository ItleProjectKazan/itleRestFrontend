import { http } from '~/core/axios'
import { TUser } from '~/types/misc'
import { ApiEndpoints } from '~/constants/apiEndpoints'

export const fetchUser = async (): Promise<TUser | null> => {
    try {
        const user = (await http.get<TUser>(ApiEndpoints.PROFILE)).data
        return user
    } catch (error: any) {
        // Unauthenticated
        if (error.response?.status !== 403) {
            throw error
        }
    }

    return null
}
