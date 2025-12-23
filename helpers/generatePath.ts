export const generatePath = (route: string, parameters: Record<string, string | number>): string => {
    return Object.keys(parameters).reduce((url, paramName) => {
        return url.replace(new RegExp(`:${ paramName }`), encodeURIComponent(parameters[paramName]))
    }, route)
}
