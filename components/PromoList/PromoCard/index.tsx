import React, { FC, memo } from 'react'
import { observer } from 'mobx-react-lite'
import { Typography } from '~/components'
import { removeTags } from '~/helpers/removeTags'

type IPromoCard = {
    name: string
    text: string
    image: string
    promo: string
}

const PromoCard: FC<IPromoCard> = observer(({ name, text, image, promo }: IPromoCard) => {
    return (
        <div className='promotions-list__item d-flex' style={{ backgroundImage: 'url(' + image + ')' }}>
            {/* <a className='promotions-list__item-inner d-flex flex-column items-start' href={'/promos/' + promo.slug}> */}
            <div className='promotions-list__item-inner d-flex flex-column items-start'>
                <Typography className='promotions-list__item-title'>{name}</Typography>
                {removeTags(text) ? (
                    <span className='promotions-list__item-description' dangerouslySetInnerHTML={{ __html: text }} />
                ) : null}
                {promo ? (
                    <div className='promotions-list__item-code d-flex items-center'>
                        Промокод
                        <div className='d-flex items-center'>{promo}</div>
                    </div>
                ) : null}
            </div>
        </div>
    )
})

export default memo(PromoCard)
