export type {
  Journey,
  Checkpoint,
  JourneyActivity,
  MultipleChoiceActivity,
  TrueFalseActivity,
  FillBlankActivity,
  FreeResponseActivity,
  ActivityAnswer,
  ActivityAnswers,
  ActivityType
} from './types'

export { journeyReducer, journeyActions } from './model/slice'
export type { StateSchemaJourney } from './model/slice'
