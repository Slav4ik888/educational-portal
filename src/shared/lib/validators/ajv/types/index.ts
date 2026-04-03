
export interface AjvErr {
  dataPath: string
}

export interface AjvErrors {
  dataPath: string
  keyword : string
  message : string
  params: {
    additionalProperty? : string
    missingProperty?    : string
  }
  schemaPath: string
}
