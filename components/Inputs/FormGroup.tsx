import { FC } from 'react'
import { Typography } from '~/components'
import classNames from 'classnames'

type Props = {
    className?: string
    label?: string
}

export const FormGroup: FC<Props> = ({ className, children, label}) => {

    return (
        <div className={ classNames(className, 'form-group d-flex flex-column flex-2-3') }>
            { label && <Typography className="mb-12 fs-22">{ label }</Typography> }
            <div className="form-group--wrap form-grid">{ children }</div>
        </div>
    )
}
