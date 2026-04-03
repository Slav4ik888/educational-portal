/** Типы для MessageBar */
export enum MessageType {
  SUCCESS = 'success',
  INFO    = 'info',
  WARNING = 'warning',
  ERROR   = 'error',
}

export interface Message {
  type     : MessageType
  message  : string
  timeout? : number
}
