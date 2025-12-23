declare module '*.svg' {
    import type { FC, SVGProps } from 'react'

    const component: FC<SVGProps<SVGSVGElement>>

    export default component
}

declare module 'react-input-mask' {
    const ReactInputMask: any

    export default ReactInputMask
}

declare module 'react-scrollspy-navigation' {
    const ReactScrollspyNavigation: any

    export default ReactScrollspyNavigation
}

declare module 'react-stickynode' {
    const ReactScrollspyNavigation: any

    export default ReactScrollspyNavigation
}
