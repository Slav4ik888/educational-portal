export interface GlossaryTerm {
  term       : string
  definition : string
  aliases?   : string[] // Альтернативные названия (например, "LLM" и "Large Language Model")
}
