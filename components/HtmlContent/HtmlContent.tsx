import React from 'react'

import styles from './HtmlContent.module.scss'

type Props = {
    content?: string | null
}

export const HtmlContent: React.FC<Props> = ({
    content,
}) => {
    return (
        <div className={ styles.htmlContent }>
            <div dangerouslySetInnerHTML={{ __html: content as string }} />
        </div>
    )
}

export default HtmlContent
