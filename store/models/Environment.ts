import { Instance, types } from 'mobx-state-tree'

export type TEnvironment = Instance<typeof Environment>

export const Environment = types
    .model('Environment', {
        pickup_discount: types.number,
        max_cutlery_count: types.number,
    })
