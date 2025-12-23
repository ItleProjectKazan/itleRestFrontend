export const QUERY_KEYS = {
    BANNERS: (restaurantId: number | undefined) => ['banners', restaurantId],
    CATEGORIES: (restaurantId: number | undefined) => ['categories', restaurantId],
    POPULAR_PRODUCTS: (restaurantId: number | undefined) => ['popular-products', restaurantId],
    PRODUCTS: (restaurantId: number | undefined) => ['products', restaurantId],
    NEWS: (restaurantId?: number) => ['news', restaurantId],
    TRIPLE_SLIDER: () => ['triple-slider'],
    AUTH_CUSTOMER: (limit?: number, offset?: number) => ['/orders/auth-customer', limit, offset],
    PROMOS: (limit?: number, offset?: number) => ['promos', limit, offset],
    PAGES_PREVIEW: (type: string, limit?: number, offset?: number) => ['/content/pages-preview', type, limit, offset],
    VACANCY: (limit?: number, offset?: number) => ['vacancy', limit, offset],
}
