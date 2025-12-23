export type TTripleSlider = {
    left: [{ id: string; original_url: string }]
    middle: [
        {
            id: string
            media: [
                {
                    id: string
                    original_url?: string
                    custom_properties?: {
                        text?: string
                        link?: string
                        icon?: string
                    }
                },
            ]
        },
    ]
    right: [
        {
            id: string
            original_url: string
        },
    ]
}
