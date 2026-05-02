import { ActivityType } from 'entities/journey'

export interface CheckpointRecord {
  concept      : string
  accuracy     : number
  mistakeTypes : ActivityType[]
}

export interface JourneyRecord {
  id                : string
  title             : string
  topic             : string
  completedAt       : string
  accuracy          : number
  xpEarned          : number
  checkpointResults : CheckpointRecord[]
}

export interface PersonalContextState {
  journeyHistory : JourneyRecord[]
}
