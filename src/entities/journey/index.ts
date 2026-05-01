export type {
  Journey,
  Checkpoint,
  JourneyActivity,
  AiEvaluatedActivity,
  MultipleChoiceActivity,
  TrueFalseActivity,
  FillBlankActivity,
  FreeResponseActivity,
  ExplainLikeImFiveActivity,
  TeachBackActivity,
  GiveYourExampleActivity,
  DebugTheLogicActivity,
  ActivityAnswer,
  ActivityAnswers,
  ActivityAnswerValue,
  ActivityType,
} from './types'

export { AI_EVALUATED_TYPES } from './types'
export { journeyReducer, journeyActions } from './model/slice'
export type { StateSchemaJourney } from './model/slice'
export { ActivityRenderer } from './ui/activity-renderer'
export { checkActivityCorrect } from './lib/check-activity-correct'
