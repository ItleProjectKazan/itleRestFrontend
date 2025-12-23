import React from 'react'
import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
    // const GTM = process.env.NEXT_TYPE == 'bistro' ? 'GTM-W42G4SP' : 'GTM-W9S5W7K'

    return (
        <Html>
            <Head />

            <body>
                {/*Google Tag Manager (noscript)*/}
                {/* {
                    process.env.NEXT_SERVER === 'production' &&
                    <noscript>
                        <iframe
                            height="0"
                            src={ 'https://www.googletagmanager.com/ns.html?id=' + GTM }
                            style={{ display: 'none', visibility: 'hidden' }}
                            width="0"
                        />
                    </noscript>
                } */}
                {/*End Google Tag Manager (noscript)*/}

                {/* Top.Mail.Ru counter */}
                <script
                  type="text/javascript"
                  dangerouslySetInnerHTML={{
                    __html: `
                            var _tmr = window._tmr || (window._tmr = []);
                            _tmr.push({id: "3696153", type: "pageView", start: (new Date()).getTime()});
                            (function (d, w, id) {
                                if (d.getElementById(id)) return;
                                var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id;
                                ts.src = "https://top-fwz1.mail.ru/js/code.js";
                                var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);};
                                if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }
                            })(document, window, "tmr-code");
                        `
                  }}
                />
                <noscript>
                  <div>
                    <img
                      src="https://top-fwz1.mail.ru/counter?id=3696153;js=na"
                      style={{ position: 'absolute', left: '-9999px' }}
                      alt="Top.Mail.Ru"
                    />
                  </div>
                </noscript>
                {/* /Top.Mail.Ru counter noscript */}
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
