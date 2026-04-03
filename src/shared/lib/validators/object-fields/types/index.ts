export interface ContainsField {
  [S: string]: unknown
}

export interface ValidateOptions {
  required?: boolean
}

export interface ValidateNumberOptions extends ValidateOptions {
  min?   : number
  max?   : number
}

export interface ValidateStringOptions extends ValidateNumberOptions {
  length? : number // Must be oneOf: length or (max min)
}
