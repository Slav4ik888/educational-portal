import { ActivityType } from 'entities/journey'

export interface CheckpointRecord {
  concept         : string
  accuracy        : number
  mistakeTypes    : ActivityType[]
  durationSec     : number
  timedOut        : boolean
}

export interface JourneyRecord {
  id                : string
  title             : string
  topic             : string
  completedAt       : string
  accuracy          : number
  xpEarned          : number
  durationSec       : number
  checkpointResults : CheckpointRecord[]
}

export interface PersonalContextState {
  journeyHistory : JourneyRecord[]
}
