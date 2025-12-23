import { FC, useEffect, useState } from 'react'
import Image from 'next/legacy/image'

type Props = {
    alt: string
    src: string
    fallbackSrc: string
    [key: string]: any
}

export const ImageWithFallback: FC<Props> = ({ alt, src, fallbackSrc, ...props }) => {
    const [imgSrc, set_imgSrc] = useState(src)

    useEffect(() => {
        set_imgSrc(src)
    }, [src])

    return (
        <Image
            alt={alt}
            onError={() => {
                set_imgSrc(fallbackSrc)
            }}
            onLoadingComplete={(result) => {
                if (result.naturalWidth === 0) {
                    set_imgSrc(fallbackSrc)
                }
            }}
            src={imgSrc}
            {...props}
        />
    )
}
