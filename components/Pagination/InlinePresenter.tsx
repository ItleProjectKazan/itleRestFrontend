import { FC, memo } from 'react'
import cn from 'classnames'
import styles from './styles.module.scss'

interface IPagination {
    pagesCount: number
    currentPage: number
    pageClick: (page: number) => () => void
}

const InlinePresenter: FC<IPagination> = ({ pagesCount, currentPage, pageClick }: IPagination) => {
    const pages = Array.from(Array(pagesCount).keys())
    return (
        <div className={styles.pagination}>
            <div
                className={cn(styles.paginationItem, { [styles.disabled]: currentPage === 1 })}
                onClick={pageClick(currentPage - 1)}
            >
                <span className='icon-angle-left'></span>
            </div>
            {pages.map((item) => (
                <div
                    key={item}
                    className={cn(styles.paginationItem, { [styles.active]: currentPage === item + 1 })}
                    onClick={pageClick(item + 1)}
                >
                    {item + 1}
                </div>
            ))}
            <div
                className={cn(styles.paginationItem, { [styles.disabled]: currentPage === pages.length })}
                onClick={pageClick(currentPage + 1)}
            >
                <span className='icon-angle-right'></span>
            </div>
        </div>
    )
}

export default memo(InlinePresenter)
