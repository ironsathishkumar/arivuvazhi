export interface ScoringRules {
  marksPerQuestion: number;
  negativeMarkPerWrong: number;
}

/** true = correct, false = wrong, null = skipped or never answered. */
export type AnswerOutcome = boolean | null;

export interface ScoreSummary {
  total: number;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  /** Percentage of attempted questions answered correctly (0–100). */
  accuracy: number;
  score: number;
  maxScore: number;
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function scoreAnswers(rules: ScoringRules, outcomes: readonly AnswerOutcome[]): ScoreSummary {
  let correct = 0;
  let wrong = 0;
  for (const outcome of outcomes) {
    if (outcome === true) correct++;
    else if (outcome === false) wrong++;
  }
  const total = outcomes.length;
  const attempted = correct + wrong;

  return {
    total,
    attempted,
    correct,
    wrong,
    skipped: total - attempted,
    accuracy: attempted === 0 ? 0 : round2((correct / attempted) * 100),
    score: round2(correct * rules.marksPerQuestion - wrong * rules.negativeMarkPerWrong),
    maxScore: round2(total * rules.marksPerQuestion),
  };
}
