export const AppLinks = {
    ios: 'https://apps.apple.com/us/app/%D0%B8%D1%82%D0%BB%D0%B5-%D0%B4%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BA%D0%B0-%D0%B5%D0%B4%D1%8B/id6744911795',
    android: 'https://play.google.com/store/apps/details?id=cc.sellkit.itle',
    qrCodeImage: '/images/app-qr-code.png',
}

export const isIOS = () => {
    if (typeof window === 'undefined') return false
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
}

export const isAndroid = () => {
    if (typeof window === 'undefined') return false
    return /Android/.test(navigator.userAgent)
}

export const getAppLink = () => {
    if (isIOS()) return AppLinks.ios
    if (isAndroid()) return AppLinks.android
    return AppLinks.android
}
