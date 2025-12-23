import React, { FC, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IMSTArray, ISimpleType } from 'mobx-state-tree'
import { usePopper } from 'react-popper'
import { useDebounce } from 'use-debounce'
import { useQuery } from 'react-query'
import { memoize } from 'lodash'
import classNames from 'classnames'
import { withYMaps } from '@pbe/react-yandex-maps'
import { http } from '~/core/axios'
import { useOnClickOutside } from '~/hooks'
import { Typography } from '~/components'
import { sameWidth } from '~/constants/popperModifiers'
import { convertLocationSuggestions } from './convertLocationSuggestions'
import { TCoords, TLocality } from '~/types/misc'
import styles from './LocationInput.module.scss'

interface Props {
    borderBox: {
        lowerCorner: IMSTArray<ISimpleType<number>>
        upperCorner: IMSTArray<ISimpleType<number>>
    }
    coordinates?: {
        latitude: number
        longitude: number
    }
    locality: TLocality
    onChange?: (searchQuery: string) => void
    onSelect?: (parameter: {
        province: string
        locality: string
        address: string
        street: string
        house: string
        coords: TCoords
    }) => void
    value?: string
}

const LocationInput = withYMaps<Props & any>(
    ({ borderBox, coordinates, locality, onChange, onSelect, value, ymaps }) => {
        const rootRef = useRef(null)

        const [searchQuery, setSearchQuery] = useState(value ?? '')
        const [suggestions, setSuggestions] = useState<string[]>([])
        const [loadSuggestions, setLoadSuggestions] = useState(false)
        const [showSuggestions, setShowSuggestions] = useState(false)
        const [inputRef, setInputRef] = useState<HTMLElement | null>(null)
        const [popperEl, setPopperEl] = useState<any>(null)
        const [needFixAddress, setNeedFixAddress] = useState(false)

        const [debouncedSearchQuery] = useDebounce(searchQuery, 1000, {
            maxWait: 2000,
        })

        useOnClickOutside(
            rootRef,
            useCallback(() => {
                setShowSuggestions(false)
            }, []),
        )

        useQuery(
            ['location-search', debouncedSearchQuery, locality],
            useCallback(async () => {
                if (borderBox.lowerCorner === null || borderBox.upperCorner === null) {
                    return []
                }

                // https://yandex.ru/dev/maps/jsapi/doc/2.1/ref/reference/suggest.html
                const suggestion = await ymaps.suggest(locality.region + ', ' + debouncedSearchQuery, {
                    boundedBy: [borderBox.lowerCorner, borderBox.upperCorner],
                })

                return suggestion.map((suggestion: any) => suggestion.displayName)
            }, [borderBox, debouncedSearchQuery, ymaps]),
            {
                enabled: loadSuggestions && debouncedSearchQuery.length >= 3,
                onSuccess: (suggestions) => {
                    setSuggestions(suggestions)
                    setShowSuggestions(true)
                },
            },
        )

        const { styles: popperStyles, attributes: popperAttributes } = usePopper(inputRef, popperEl, {
            placement: 'bottom-start',
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [0, 8],
                    },
                },
                sameWidth,
            ],
        })

        // update the search query state when the value prop is updated
        useEffect(() => {
            if (value === undefined) {
                return
            }

            setSearchQuery(value)
        }, [value])

        const handleInputChange = useCallback(
            (event: FormEvent<HTMLInputElement>) => {
                const value = event.currentTarget.value

                setLoadSuggestions(true)
                setSearchQuery(value)
                setNeedFixAddress(false)

                if (onChange !== undefined) {
                    onChange(value)
                }
            },
            [onChange],
        )

        const borderBoxStr = useMemo(() => {
            if (borderBox.lowerCorner === null || borderBox.upperCorner === null) {
                return undefined
            }

            const lowerCorner = [...borderBox.lowerCorner].reverse().join(',')
            const upperCorner = [...borderBox.upperCorner].reverse().join(',')

            return `${lowerCorner}~${upperCorner}`
        }, [borderBox])

        const getApiKey = () => {
            const apiKeysString = process.env.NEXT_PUBLIC_YANDEX_GEOCODER_KEY
            const apiKeysArray = apiKeysString?.split('|')

            return apiKeysArray === undefined ? '' : apiKeysArray[Math.floor(Math.random() * apiKeysArray.length)]
        }

        const handleSuggestionClick = useCallback(
            memoize((suggestionText: string) => async () => {
                setSearchQuery(suggestionText)
                setLoadSuggestions(false)
                setShowSuggestions(false)

                if (!/[0-9]/.test(suggestionText)) {
                    setNeedFixAddress(true)

                    return
                }

                if (onSelect !== undefined) {
                    const response = await http.get('https://geocode-maps.yandex.ru/1.x', {
                        params: {
                            apikey: getApiKey(),
                            bbox: borderBoxStr,
                            format: 'json',
                            geocode: locality.name + ', ' + suggestionText,
                            kind: 'house',
                            lang: 'ru_RU',
                            // specify searching coordinates to get locality addresses first
                            ll:
                                coordinates !== undefined
                                    ? `${coordinates.longitude},${coordinates.latitude}`
                                    : undefined,
                            results: 5,
                            rspn: 1,
                        },
                        withCredentials: false,
                    })

                    const suggestions = convertLocationSuggestions(response.data)

                    if (suggestions.length === 0) {
                        return
                    }

                    // https://yandex.ru/dev/maps/jsbox/2.1/input_validation
                    if (suggestions[0].precision !== 'exact' && suggestions[0].precision !== 'other') {
                        setNeedFixAddress(true)

                        return
                    }

                    onSelect({
                        address: suggestionText,
                        province: suggestions[0].components.province,
                        locality: suggestions[0].components.locality,
                        street: suggestions[0].components.street !== undefined ? suggestions[0].components.street : '',
                        house: suggestions[0].components.house,
                        coords: {
                            latitude: suggestions[0].latitude,
                            longitude: suggestions[0].longitude,
                        },
                    })
                }
            }),
            [borderBoxStr, coordinates, onChange, onSelect],
        )

        return (
            <div>
                <div ref={rootRef}>
                    <label ref={setInputRef} className={styles.container}>
                        <input
                            className={styles.input}
                            onInput={handleInputChange}
                            placeholder='Укажите  адрес доставки'
                            type='text'
                            value={searchQuery}
                        />
                        <span className={styles.label}>Адрес доставки</span>
                    </label>
                    {showSuggestions && (
                        <div
                            ref={setPopperEl}
                            className={classNames(styles.dropdown, {
                                [styles.dropdownEmpty]: suggestions.length === 0,
                            })}
                            style={popperStyles.popper}
                            {...popperAttributes.popper}
                        >
                            {suggestions.length === 0 && <Typography weight='semi-bold'>Ничего не найдено</Typography>}
                            {suggestions.map((suggestion) => (
                                <div
                                    key={suggestion}
                                    className={styles.suggestion}
                                    onClick={handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {needFixAddress && (
                    <Typography className='mt-8' color='error'>
                        Пожалуйста, укажите точный адрес с номером дома.
                    </Typography>
                )}
            </div>
        )
    },
    false,
    ['suggest'],
) as FC<Props>

export { LocationInput }
