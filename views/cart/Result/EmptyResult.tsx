import React, { FC } from 'react'
import { Button, Result } from '~/components'
import { getMenuLink } from '~/constants/pageLinks'
import { useStore } from '~/hooks'

import styles from './Result.module.scss'

import CartIcon from '~/public/images/cart-beams.svg'

export const EmptyResult: FC = () => {
    const { cartModal, orderParams } = useStore()
    return (
        <Result
            classes={{
                icon: styles.icon,
                root: styles.root,
                subtitle: [styles.text, styles.subtitle],
                title: [styles.text, styles.title],
            }}
            icon={CartIcon}
            subtitle='Для заказа выберите блюда из меню'
            title='В корзине пока ничего нет'
        >
            <Button
                fullWidth
                href={getMenuLink(orderParams.restaurantId)}
                size='large'
                onClick={() => cartModal.close()}
            >
                Перейти в меню
            </Button>
        </Result>
    )
}
