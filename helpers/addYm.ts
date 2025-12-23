const YA_KEY = 44399665

export const addYm = (t: string, value: string) =>
    setTimeout(() => {
        //@ts-ignore
        ym(YA_KEY, t, value)
    }, 0)

// reachGoal
