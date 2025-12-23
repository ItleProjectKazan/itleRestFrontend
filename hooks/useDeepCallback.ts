import { DependencyList } from 'react'

import { useDeepMemo } from '~/hooks'

export const useDeepCallback = <T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T => {
    return useDeepMemo(() => callback, deps)
}
