import React from 'react'
import styles from './ITLEKitchenInfoBlocks.module.scss'
// import Image from 'next/dist/client/image'
import Image from 'next/legacy/image'

type Block = {
    img: string
    name: string
}

const ITLEKitchenInfoBlocks = () => {
    const blocks: Block[] = [
        {
            img: '/images/mask-group.png',
            name: 'Сытные сеты',
        },
        {
            img: '/images/mask-group-1.png',
            name: 'Бизнес ланч',
        },
        {
            img: '/images/mask-group-2.png',
            name: 'Новинки меню',
        },
        {
            img: '/images/mask-group-3.png',
            name: 'Большие порции',
        },
        {
            img: '/images/mask-group-4.png',
            name: 'Хиты сезона',
        },
        {
            img: '/images/mask-group-5.png',
            name: 'Домашняя выпечка',
        },
    ]

    return (
        <div className='container'>
            <div className={styles.label} onClick={() => (location.href = 'https://itlekitchen.ru/')}>
                Фабрика готовой еды
            </div>
            <div className={styles.banners}>
                {blocks.map((block) => (
                    <div key={block.name} className={styles.item}>
                        <div className={styles.img}>
                            <Image width={164} height={111} src={block.img} />
                        </div>
                        <div className={styles.name}>{block.name}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export { ITLEKitchenInfoBlocks }
