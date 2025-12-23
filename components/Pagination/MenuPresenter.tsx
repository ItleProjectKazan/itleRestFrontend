import { FC, useState, useCallback, useEffect, memo } from 'react'
import cn from 'classnames'
import styles from './styles.module.scss'

interface IPagination {
    pagesCount: number
    currentPage: number
    pageClick: (page: number) => () => void
}

const MenuPresenter: FC<IPagination> = ({ pagesCount, currentPage, pageClick }: IPagination) => {
    const pages = Array.from(Array(pagesCount).keys())
    const [showMenu, setShowMenu] = useState(false)

    const onMenuClick = useCallback(() => {
        setShowMenu(!showMenu)
    }, [showMenu])

    const onMenuCloseClick = useCallback(() => {
        setShowMenu(false)
    }, [])

    const hideMenu = (e: MouseEvent) => {
        if (!(e.target as HTMLElement).closest('.paginationMenu')) {
            setShowMenu(false)
        }
    }

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.addEventListener('click', hideMenu)
        }
        return () => document.removeEventListener('click', hideMenu)
    }, [])

    return (
        <div className={cn(styles.pagination, styles.paginationMenu, 'paginationMenu')}>
            <div
                className={cn(styles.paginationItem, { [styles.disabled]: currentPage === 1 })}
                onClick={pageClick(currentPage - 1)}
            >
                <span className='icon-angle-left'></span>
            </div>
            {[1, 2, 3].map((item) => (
                <div
                    className={cn(styles.paginationItem, { [styles.active]: currentPage === item })}
                    key={item}
                    onClick={pageClick(item)}
                >
                    {item}
                </div>
            ))}
            <div className={styles.paginationMenuBlock} onClick={onMenuClick}>
                {[1, 2, 3, pagesCount - 2, pagesCount - 1, pagesCount].includes(currentPage) ? (
                    <div className={styles.activeDots}>&bull; &bull; &bull; </div>
                ) : (
                    <div className={styles.activeDots}>
                        <div className={styles.dots}>&bull; &bull; &bull;</div>
                        <div className={cn(styles.paginationItem, styles.active, styles.currernt)}>{currentPage}</div>
                        <div className='dots'>&bull; &bull; &bull;</div>
                    </div>
                )}
            </div>
            {[pagesCount - 2, pagesCount - 1, pagesCount].map((item) => (
                <div
                    className={cn(styles.paginationItem, { [styles.active]: currentPage === item })}
                    key={item}
                    onClick={pageClick(item)}
                >
                    {item}
                </div>
            ))}
            <div
                className={cn(styles.paginationItem, { [styles.disabled]: currentPage === pages.length })}
                onClick={pageClick(currentPage + 1)}
            >
                <span className='icon-angle-right'></span>
            </div>
            <div className={cn(styles.paginationBlock, { [styles.active]: showMenu })}>
                <div onClick={onMenuCloseClick}>
                    <div className='close'></div>
                </div>
                <div className={styles.paginationMenu}>
                    {pages.map((item) => (
                        <div
                            className={cn(styles.paginationItem, { [styles.active]: currentPage === item })}
                            key={item}
                            onClick={pageClick(item)}
                        >
                            {item + 1}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default memo(MenuPresenter)
