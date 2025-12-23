import React, { FC, ReactElement } from 'react'
import classNames from 'classnames'

import { Button } from '~/components'

import styles from './Footer.module.scss'
import { PageLinks } from '~/constants/pageLinks'

type Props = {
    className?: string
    actionComponent?: ReactElement
    backToCart?: boolean
    backToCatalog?: boolean
    summaryComponent?: ReactElement
}

export const Footer: FC<Props> = ({
    className,
    actionComponent,
    backToCart = false,
    summaryComponent,
}) => {

    return (
        <div className={ classNames(styles.cartFooter, className) }>
            <div className={ styles.footerWrapper }>
                {
                    summaryComponent &&
                    <section className={ styles.footerTop }>{ summaryComponent }</section>
                }
                <section className={ classNames(styles.cartAction, 'px-md-0') }>
                    <div className="d-flex align-items-center justify-content-between">
                        {
                            backToCart &&
                            <Button className="d-none-phone-large" href={ PageLinks.CART } size="large" variant="outlined">
                                Назад в корзину
                            </Button>
                        }
                        { actionComponent }
                    </div>
                </section>
            </div>
        </div>
    )
}
