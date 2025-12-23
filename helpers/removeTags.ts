export const removeTags = (body?: string): string => {
    if (!body) return ''
    const regex = /(<([^>]+)>)/gi
    return body.replace(regex, '')
}