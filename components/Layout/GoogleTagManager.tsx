import React from 'react'
import Script from 'next/script'

declare global {
    interface Window {
        dataLayer: any
    }
}


export const GoogleTagManager = () => {

    if (process.env.NEXT_SERVER !== 'production') {
        return null
    }

    const GTM = process.env.NEXT_TYPE == 'bistro' ? 'GTM-W42G4SP' : 'GTM-W9S5W7K'

    return (
        <>
            <Script
                id="google-tag"
                strategy="lazyOnload"
            >
                { `
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','` + GTM + `');
                ` }
            </Script>
            <noscript><iframe height="0" src={ 'https://www.googletagmanager.com/ns.html?id=' + GTM } style={{display: 'none', visibility: 'hidden'}} width="0"></iframe></noscript>
        </>
    )
}
