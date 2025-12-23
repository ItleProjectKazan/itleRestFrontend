import { FC } from 'react'
import BonusIcon from '~/public/images/bonus.svg'

interface Props {
    value: number
}

export const Bonuses: FC<Props> = ({
    value,
}) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)' }}>
            <BonusIcon style={{ marginRight: '7px' }} />
            <span>{ value }</span>
        </div>
    )
}
