import { FC } from 'react'
import InlinePresenter from './InlinePresenter'
import MenuPresenter from './MenuPresenter'

interface IPagination {
    pagesCount: number
    currentPage: number
    pageClick: (page: number) => void
}

const Pagination: FC<IPagination> = ({ pagesCount, currentPage, pageClick }: IPagination): JSX.Element | null => {
    if (pagesCount <= 1) {
        return null
    }
    const onPageClick = (page: number) => () => {
        pageClick(page)
    }
    if (pagesCount <= 10) {
        return <InlinePresenter currentPage={currentPage} pagesCount={pagesCount} pageClick={onPageClick} />
    }
    return <MenuPresenter currentPage={currentPage} pagesCount={pagesCount} pageClick={onPageClick} />
}
export default Pagination
