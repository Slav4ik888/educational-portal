import { Journey, ActivityAnswers } from '../../types'

export interface StateSchemaJourney {
  current                : Journey | null
  isGenerating           : boolean
  error                  : string | null
  answers                : ActivityAnswers
  submittedCheckpointIds : string[]
  checkpointDurations    : Record<string, number>
  journeyStartedAt       : string | null
  progress               : {
    currentCheckpointIdx : number
    completedCheckpoints : string[]
    timedOutCheckpoints  : string[]
  }
}
