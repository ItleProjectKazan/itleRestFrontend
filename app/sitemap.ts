import type { MetadataRoute } from 'next'
import { getPagePreview } from '~/services/queries'
import { TPagePreview } from '~/types/pages/page'
import { TCategoryPageMenuItem } from '~/types/pages/category'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const categories = await getPagePreview<TPagePreview<TCategoryPageMenuItem[]>, TCategoryPageMenuItem[]>('category')

    const sitemap = [
        {
            url: 'https://itle.pro',
            lastModified: new Date(),
            priority: 1,
        },
        {
            url: 'https://itle.pro/about',
            lastModified: new Date(),
            priority: 0.8,
        },
        {
            url: 'https://itle.pro/menu',
            lastModified: new Date(),
            priority: 0.8,
        },
        {
            url: 'https://itle.pro/menu/2',
            lastModified: new Date(),
            priority: 0.8,
        },
        {
            url: 'https://itle.pro/menu/4',
            lastModified: new Date(),
            priority: 0.8,
        },
        {
            url: 'https://itle.pro/events',
            lastModified: new Date(),
            priority: 0.8,
        },
        {
            url: 'https://itle.pro/interior',
            lastModified: new Date(),
            priority: 0.8,
        },
        {
            url: 'https://itle.pro/vacancy',
            lastModified: new Date(),
            priority: 0.8,
        },
        {
            url: 'https://itle.pro/delivery',
            lastModified: new Date(),
            priority: 0.8,
        },
    ]

    categories?.content_pages?.forEach(({ code }) => {
        if (code) {
            sitemap.push({
                url: `https://itle.pro/category/${code}`,
                lastModified: new Date(),
                priority: 0.8,
            })
        }
    })
    return sitemap
}
