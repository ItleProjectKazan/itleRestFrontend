import Cookies from 'js-cookie'

export const SettingsService = {
    get: (key: string) => {
        return Cookies.get(key) ?? null
    },
    set: (key: string, value: string | number | null) => {
        if (typeof value === 'number') {
            value = value.toString()
        }

        if (value === undefined || value === null) {
            Cookies.remove(key)
        } else {
            Cookies.set(key, value, {
                expires: 365,
            })
        }
    },
    remove: (key: string) => {
        Cookies.remove(key)
    },
}
