import React from 'react'
// import Link from 'next/link'
import { format } from 'date-fns'

import { useStore } from '~/hooks'

// import { PageLinks } from '~/constants/pageLinks'
// import { Button, Typography } from '~/components'

// import styles from './ProfileIntro.module.scss'

// import Bonuses from '~/public/images/bonuses.svg'

const ProfileIntro = () => {
    const { user } = useStore()
    return (
        <div className='bonuses'>
            <div className='bonuses__top d-flex items-center'>
                <span className='bonuses__top-icon icon-wallet'></span>
                <div className='bonuses__top-info d-flex flex-column'>
                    <span className='bonuses__top-text'>Доступно бонусов</span>
                    <span className='bonuses__top-amount'>{user?.bonus_count ?? 0}</span>
                </div>
            </div>
            {user?.bonus_expiration_date && user?.bonus_count && user?.bonus_count !== null && user?.bonus_count > 0 ? (
                <div className='bonuses__details'>
                    Ваш бонусные баллы действуют до{' '}
                    <span>{format(new Date(user?.bonus_expiration_date), 'dd.MM.yyyy')}</span>
                </div>
            ) : null}
        </div>
    )
}

ProfileIntro.displayName = 'ProfileIntro'

export default ProfileIntro
