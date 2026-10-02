import { scoreAnswers } from '../../src/modules/scoring/scoring';

describe('scoreAnswers', () => {
  it('scores TNPSC-style rules (1.5 marks, no negative marking)', () => {
    const summary = scoreAnswers({ marksPerQuestion: 1.5, negativeMarkPerWrong: 0 }, [true, true, false, null]);
    expect(summary).toEqual({
      total: 4,
      attempted: 3,
      correct: 2,
      wrong: 1,
      skipped: 1,
      accuracy: 66.67,
      score: 3,
      maxScore: 6,
    });
  });

  it('applies negative marking and rounds to two decimals', () => {
    const summary = scoreAnswers({ marksPerQuestion: 1, negativeMarkPerWrong: 1 / 3 }, [true, false, false, false]);
    expect(summary.score).toBe(0);
    const s2 = scoreAnswers({ marksPerQuestion: 2, negativeMarkPerWrong: 1 / 3 }, [true, false]);
    expect(s2.score).toBe(1.67);
  });

  it('allows negative totals', () => {
    const summary = scoreAnswers({ marksPerQuestion: 1, negativeMarkPerWrong: 0.25 }, [false, false]);
    expect(summary.score).toBe(-0.5);
  });

  it('returns zero accuracy when nothing was attempted', () => {
    const summary = scoreAnswers({ marksPerQuestion: 1, negativeMarkPerWrong: 0 }, [null, null]);
    expect(summary.accuracy).toBe(0);
    expect(summary.skipped).toBe(2);
  });

  it('handles an empty attempt', () => {
    expect(scoreAnswers({ marksPerQuestion: 1, negativeMarkPerWrong: 0 }, []).maxScore).toBe(0);
  });
});
