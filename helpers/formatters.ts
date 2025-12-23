export const formatPrice = (price: number|string) => {
    return (+ price).toFixed(0) + ' ₽' as string
}

export const formatWeight = (value: number, units = null) => {
    return (value * 1000).toFixed(0) + ' ' + (units || 'гр.') as string
}
