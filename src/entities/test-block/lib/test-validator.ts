import {
  TestQuestion, TestUserAnswer, QuestionResult, MatchPairsQuestion, MultipleChoiceQuestion
} from '../types'


export class TestValidator {
  static validate(question: TestQuestion, userAnswer: TestUserAnswer): QuestionResult {
    switch (question.type) {
      case 'multiple-choice':
        return this.validateMultipleChoice(question, userAnswer)
      case 'match-pairs':
        return this.validateMatchPairs(question, userAnswer)
      // case 'true-false':
      //   return this.validateTrueFalse(question, userAnswer)
      // case 'fill-blank':
      //   return this.validateFillBlank(question, userAnswer)
      // case 'order-steps':
      //   return this.validateOrderSteps(question, userAnswer)
      default:
        throw new Error('Unknown question type')
    }
  }

  private static validateMultipleChoice(
    question: MultipleChoiceQuestion,
    answer: TestUserAnswer
  ): QuestionResult {
    if (answer.type !== 'multiple-choice') throw new Error('Invalid answer type')

    const userSet = new Set(answer.value)
    const correctSet = new Set(question.correctAnswers)
    const isCorrect = userSet.size === correctSet.size
      && [...userSet].every(v => correctSet.has(v))

    return {
      questionId: question.id,
      isCorrect,
      score: isCorrect ? question.points : 0,
      maxScore: question.points,
      details: { userAnswer: answer.value, correct: question.correctAnswers }
    }
  }

  private static validateMatchPairs(
    question: MatchPairsQuestion,
    answer: TestUserAnswer
  ): QuestionResult {
    if (answer.type !== 'match-pairs') throw new Error('Invalid answer type')

    let correctMatches = 0
    Object.entries(answer.value).forEach(([leftId, rightId]) => {
      const leftItem = question.leftItems.find(item => item.id === leftId)
      if (leftItem?.matchId === rightId) correctMatches++
    })

    let score = 0
    let isCorrect = false

    // eslint-disable-next-line default-case
    switch (question.scoringType) {
      case 'exact':
        isCorrect = correctMatches === question.leftItems.length
        score = isCorrect ? question.points : 0
        break
      case 'partial':
        score = (correctMatches / question.leftItems.length) * question.points
        isCorrect = score === question.points
        break
      case 'points-per-match':
        score = correctMatches * (question.pointsPerMatch || 0)
        isCorrect = score === question.points
        break
    }

    return {
      questionId: question.id,
      isCorrect,
      score,
      maxScore: question.points,
      details: {
        correctMatches,
        totalMatches: question.leftItems.length,
        partiallyCorrect: correctMatches > 0 && correctMatches < question.leftItems.length
      }
    }
  }
}
