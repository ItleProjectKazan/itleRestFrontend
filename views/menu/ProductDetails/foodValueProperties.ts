export const foodValueProperties = {
    energy_amount: {
        label: 'Энерг. ценность',
        unit: 'ккал',
    },
    protein_amount: {
        label: 'Белки',
        unit: 'г',
    },
    fat_amount: {
        label: 'Жиры',
        unit: 'г',
    },
    carbohydrate_amount: {
        label: 'Углеводы',
        unit: 'г',
    },
    fiber_amount: {
        label: 'Клечатка',
        unit: 'г',
    },
} as const

export type TFoodValueProperty = keyof typeof foodValueProperties

export const foodValuePropertyKeys = Object.keys(foodValueProperties) as TFoodValueProperty[]

export const propertyNotEmpty = (value: number | null | undefined) => {
    return value !== undefined && value !== null && value !== 0
}
