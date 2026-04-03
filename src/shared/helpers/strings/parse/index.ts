
/** If str => JSON.parse else return '' */
export const parse = (str: string | undefined) => str ? JSON.parse(str) : ''
