import React from 'react'
import styles from './Info.module.scss'
import Image from 'next/legacy/image'
import classNames from 'classnames'

const Info = () => {
    const data = [
        {
            header: `Уютная\nплощадка\nдля вашего\nторжества`,
            data: `Мы рады предложить вам проведение мероприятий в соответствии с требованиями HALAL. Наше меню состоит из вкусных и разнообразных блюд, зал хорошо освещен, индивидуальное обслуживание и интерьер, выполненный в традициях Татарстана, сделают ваше мероприятие незабываемым. `,
            photoSrc: '/images/hall/photo1.png',
            isReverse: false,
        },
        {
            header: `Проведение\nмероприятий\nбез\nалкоголя`,
            data: 'Мы гарантируем, что ваше мероприятие пройдет в спокойной, уютной атмосфере. Ведь ИTLE Bistro соблюдает все религиозные нормы и концепцию Halal, и с радостью разделит важные события вашей жизни.',
            photoSrc: '/images/hall/photo2.png',
            isReverse: true,
        },
    ]

    return (
        <div className={styles.container}>
            {data.map((item) => (
                <div
                    className={classNames(styles.item, item.isReverse ? styles.reverseItem : undefined)}
                    key={item.header}
                >
                    <div className={styles.text}>
                        <div className={styles.header}>{item.header}</div>
                        <div className={styles.mainText}>{item.data}</div>
                    </div>
                    <div className={styles.image}>
                        <Image alt='' layout='fill' objectFit='contain' src={item.photoSrc} unoptimized />
                    </div>
                </div>
            ))}
        </div>
    )
}

export { Info }
