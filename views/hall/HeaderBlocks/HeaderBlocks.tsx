import React from 'react'
import styles from './HeaderBlocks.module.scss'
import Routing from '~/public/images/routing.svg'
import Cake from '~/public/images/cake.svg'
import Car from '~/public/images/car.svg'
import Profile from '~/public/images/profile-2user.svg'

const HeaderBlocks = () => {

    return (
        <div className={styles.container}>
            <div className={styles.banners}>
                <div className={styles.item}>
                    <div className={styles.imgBlock}>
                        <div className={styles.img}>
                            <Cake />
                        </div>
                    </div>
                    <div className={styles.info}>
                        <div className={styles.name}>Разнообразное халяль меню</div>
                        <div className={styles.desc}>Великолепное банкетное меню, сочетающее в себе европейскую, восточную кухню</div>
                    </div>
                </div>

                <div className={styles.item}>
                    <div className={styles.imgBlock}>
                        <div className={styles.img}>
                            <Profile />
                        </div>
                    </div>
                    <div className={styles.info}>
                        <div className={styles.name}>Банкеты и фуршеты до 35 гостей</div>
                        <div className={styles.desc}>Мы можем предложить провести торжество или бизнес встречу в комфортном формате</div>
                    </div>
                </div>

                <div className={styles.item}>
                    <div className={styles.imgBlock}>
                        <div className={styles.img}>
                            <Routing />
                        </div>
                    </div>
                    <div className={styles.info}>
                        <div className={styles.name}>Удобное расположение зала</div>
                        <div className={styles.desc}>Великолепное банкетное меню, сочетающее в себе европейскую, восточную кухню</div>
                    </div>
                </div>

                <div className={styles.item}>
                    <div className={styles.imgBlock}>
                        <div className={styles.img}>
                            <Car />
                        </div>
                    </div>
                    <div className={styles.info}>
                        <div className={styles.name}>Удобная парковка на 10 машин</div>
                        <div className={styles.desc}>Мы можем предложить провести торжество или бизнес встречу в комфортном формате</div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export { HeaderBlocks }
