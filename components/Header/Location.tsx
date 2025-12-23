import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '~/hooks'
import { Typography } from '~/components'
import { TOrderType } from '~/types/order'

const Location = observer(() => {
    const { orderParams, restaurantSelectModal } = useStore()

    const showAddress =
        (orderParams.orderType === TOrderType.DELIVERY && orderParams.deliveryDetails !== null) ||
        (orderParams.orderType === TOrderType.PICKUP && orderParams.restaurant !== null)

    const deliveryType =
        orderParams.orderType === TOrderType.DELIVERY
            ? 'delivery'
            : orderParams.orderType === TOrderType.PICKUP
              ? 'pickup'
              : ''

    return (
        <div
            className='delivery-block d-flex items-center transition'
            onClick={() => restaurantSelectModal.open(deliveryType)}
        >
            <span className='delivery-block__icon icon-location'></span>
            {!showAddress && <Typography className='delivery-block__address'>Укажите адрес доставки</Typography>}
            {showAddress && (
                <>
                    <Typography className='delivery-block__text'>
                        {orderParams.orderType === TOrderType.DELIVERY ? 'Доставка' : 'Самовывоз'}
                    </Typography>
                    <Typography className='delivery-block__address'>
                        {orderParams.orderType === TOrderType.DELIVERY && orderParams.deliveryDetails?.address}
                        {orderParams.orderType === TOrderType.PICKUP && orderParams.restaurant?.address}
                    </Typography>
                </>
            )}
        </div>
    )
})

export { Location }
