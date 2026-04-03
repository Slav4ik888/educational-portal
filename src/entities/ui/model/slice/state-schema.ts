import { Errors } from 'shared/lib/validators';
import { Message } from '../../types/messages';
import { ScreenFormats } from '../../types/screen-formats';



export type PageLoadingType = 'get-auth'
  | 'get-g-data'
  | 'get-params-company'
  // | 'error-handlers'


export interface PageLoadingValue {
  name: string
  text: string
}

export type PageLoading = OptionalRecord<PageLoadingType, PageLoadingValue>


export interface StateSchemaUI {
  // UI
  loading        : boolean

  errors         : Errors
  errorStatus    : number

  // Page Loader
  pageLoading    : PageLoading

  // Messages
  message        : Message

  // Screens
  screenFormats  : ScreenFormats
  screenSize     : number

  // Settings
  acceptedCookie : boolean
  replacePath    : string  // For replace after login or signup
}
