/** @type {import('next').NextConfig} */
/*eslint-disable */
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//     enabled: process.env.ANALYZE === 'true',
// })
module.exports = {
    compress: true,
    poweredByHeader: false,
    reactStrictMode: true,
    env: {
        NEXT_SERVER: process.env.NEXT_SERVER,
        NEXT_TYPE: process.env.NEXT_TYPE,
    },
    images: {
        domains: ['itle.us', 'itle.buzz', 'itle-dev.devmark.pro', 'itle.pro', 'itle-bistro.ru', 'itle-bistro.ru.local'],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60,
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'itle-bistro.ru.local',
                port: '',
                pathname: '/storage/**',
                search: '',
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/robots.txt',
                destination: '/api/robots',
            },
        ]
    },
    async headers() {
        return [
            {
                source: '/:all*(svg|jpg|png|woff|woff2|ttf|webp|js|css)',
                locale: false,
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=9999999999, must-revalidate',
                    },
                ],
            },
        ]
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                child_process: false,
                fs: false,
                webpack: false,
            }
        }

        config.module.rules.push({
            test: /\.svg$/,
            issuer: [/\.(js|ts)x?$/],
            use: ['@svgr/webpack'],
        })

        return config
    },

    async redirects() {
        return [
            {
                source: '/about',
                destination: '/',
                statusCode: 301,
            },
            {
                source: '/blog/president-tatarstana-v-itle-kitchen',
                destination: '/',
                statusCode: 301,
            },
            {
                source: '/nizhnevartovck/delivery',
                destination: '/',
                statusCode: 301,
            },
            {
                source: '/nizhnevartovck/delivery',
                destination: '/',
                statusCode: 301,
            },
            {
                source: '/nizhnevartovck/menu',
                destination: '/',
                statusCode: 301,
            },
            {
                source: '/assets/docs/policy.pdf',
                destination: '/',
                statusCode: 301,
            },
            {
                source: '/blog/evolution',
                destination: '/',
                statusCode: 301,
            },
        ]
    },
}
