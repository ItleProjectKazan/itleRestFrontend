const defaultSearchCallback = (el1: any, el2: any) => JSON.stringify(el1) === JSON.stringify(el2)

export const toggleArrayElement = <T>(
    array: T[],
    element: T,
    searchCallback: (element1: T, element2: T) => boolean = defaultSearchCallback,
): T[] => {
    const index = array.findIndex((arrElement) => {
        return searchCallback(arrElement, element)
    })

    if (index >= 0) {
        array.splice(index, 1)

        return [...array]
    }

    return [...array, element]
}
