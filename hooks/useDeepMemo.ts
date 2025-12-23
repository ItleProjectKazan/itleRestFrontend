import { DependencyList, useEffect, useState } from 'react'
import { dequal } from 'dequal'

export const useDeepMemo = <T>(factory: () => T, deps: DependencyList | undefined): T => {
    const [state, setState] = useState<{
        value: T
        deps: DependencyList | undefined
    }>(() => ({
        value: factory(),
        deps,
    }))

    useEffect(() => {
        if (dequal(state.deps, deps)) {
            return
        }

        setState({
            value: factory(),
            deps,
        })

        // eslint-disable-next-line
    }, [deps])

    return state.value
}
