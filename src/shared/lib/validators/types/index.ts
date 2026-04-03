export interface Errors {
  [k: string]: string
}

export interface Validation {
  errors : Errors
  valid  : boolean
}
