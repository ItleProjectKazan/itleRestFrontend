export type TVacancy = {
    id: number
    name: string
    restaurant: {
        id: number
        name: string
        address: string
        icon: {
            id: number
            path: string
            created_at: Date
            updated_at: Date
        }
    }
    category: {
        id: number
        name: string
        icon: null
    }
    schedule: {
        id: number
        name: string
        created_at: Date
        updated_at: Date
    }
    employment: {
        id: number
        name: string
        created_at: Date
        updated_at: Date
    }
    salary: number
    responsibilities: string
    responsibilities_md: string
    requirements: string
    requirements_md: string
    conditions: string
    conditions_md: string
    experience_from: number
    experience_to: number
    emails: string
    active: number
    created_at: Date
    updated_at: Date
}
