import { FC } from 'react'

import styles from './Department.module.scss'

interface Props {
    name: string
    subtitle: string
    link: string
}

const Department: FC<Props> = ({ name, subtitle, link}) => {
    return (
        <a className={ styles.department } href={ link } rel="nofollow noreferrer" target="_blank">
            <span className={ styles.name }>{ name }</span>
            <span className={ styles.subtitle }>{ subtitle }</span>
        </a>
    )
}

export { Department }
