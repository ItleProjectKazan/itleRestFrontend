export const phoneEncoder = (phoneNumber: string) => {
    return btoa(phoneNumber + '|' + new Date().getTime() + '|' + 'xh!&sdUKGSDkh@#8**')
}

export const normalizePhone = (phoneNumber: string) => {
    return phoneNumber.replace(/[^0-9+]/g, '')
}
