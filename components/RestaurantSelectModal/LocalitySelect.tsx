import React, { FC, useCallback, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import { memoize } from 'lodash'
import { useOnClickOutside } from '~/hooks'
import { Popover } from '~/components'
import { TLocality } from '~/types/misc'
import styles from './LocalitySelect.module.scss'

interface Props {
    localities: TLocality[]
    onChange: (localityId: number) => void
    selectedLocalityId: number
}

const LocalitySelect: FC<Props> = ({ localities, onChange, selectedLocalityId }) => {
    const rootRef = useRef(null)
    const [popoverOpen, setPopoverOpen] = useState(false)
    const [popoverRef, setPopoverRef] = useState<HTMLElement | null>(null)

    useOnClickOutside(
        rootRef,
        useCallback(() => {
            setPopoverOpen(false)
        }, []),
    )

    const handleToggleClick = useCallback(() => {
        setPopoverOpen((open) => !open)
    }, [])

    const handleLocalityClick = useCallback(
        memoize((localityId: number) => () => {
            onChange(localityId)

            setPopoverOpen(false)
        }),
        [onChange],
    )

    const selectedLocality = useMemo(() => {
        return localities.find((locality) => locality.id === selectedLocalityId) as TLocality
    }, [localities, selectedLocalityId])

    return (
        <div ref={rootRef} className={styles.select}>
            <div ref={setPopoverRef} className={styles.toggle} onClick={handleToggleClick}>
                {selectedLocality.name}
            </div>
            {popoverOpen && (
                <Popover anchorEl={popoverRef} className={styles.popover}>
                    {localities.map((locality) => (
                        <div
                            key={locality.id}
                            className={classNames(styles.locality, {
                                [styles.localitySelected]: locality.id === selectedLocalityId,
                            })}
                            onClick={handleLocalityClick(locality.id)}
                        >
                            {locality.name}
                        </div>
                    ))}
                </Popover>
            )}
        </div>
    )
}

export { LocalitySelect }
