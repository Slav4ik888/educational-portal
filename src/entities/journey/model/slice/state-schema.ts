import { Journey, ActivityAnswers } from '../../types'

export interface StateSchemaJourney {
  current     : Journey | null
  isGenerating: boolean
  error       : string | null
  answers     : ActivityAnswers
  progress    : {
    currentCheckpointIdx : number
    completedCheckpoints : string[]
    timedOutCheckpoints  : string[]
  }
}
