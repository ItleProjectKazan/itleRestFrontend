export const AppLinks = {
    ios: 'https://apps.apple.com/ru/app/your-app-id',
    android: 'https://play.google.com/store/apps/details?id=your.app.id',
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
