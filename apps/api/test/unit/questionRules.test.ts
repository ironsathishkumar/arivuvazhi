import { canTransitionQuestion, createQuestionSchema, examRulesSchema } from '@arivuvazhi/shared';
import { availableLanguages } from '../../src/modules/questions/questions.service';

const ids = { examId: 'a'.repeat(24), subjectId: 'b'.repeat(24), topicId: 'c'.repeat(24) };
const option = (key: string, text: Record<string, string>) => ({ key, text });

describe('question validation', () => {
  it('rejects a correctOption that is not among the options', () => {
    const result = createQuestionSchema.safeParse({
      ...ids,
      text: { en: 'Q?' },
      options: [option('A', { en: 'a' }), option('B', { en: 'b' })],
      correctOption: 'C',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((i) => i.path.join('.') === 'correctOption')).toBe(true);
  });

  it('rejects duplicate option keys', () => {
    const result = createQuestionSchema.safeParse({
      ...ids,
      text: { en: 'Q?' },
      options: [option('A', { en: 'a' }), option('A', { en: 'b' })],
      correctOption: 'A',
    });
    expect(result.success).toBe(false);
  });

  it('requires options in every language the question text uses', () => {
    const result = createQuestionSchema.safeParse({
      ...ids,
      text: { en: 'Q?', ta: 'கேள்வி?' },
      options: [option('A', { en: 'a', ta: 'அ' }), option('B', { en: 'b' })],
      correctOption: 'A',
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path.join('.')).toBe('options.1.text.ta');
  });

  it('requires text in at least one language', () => {
    const result = createQuestionSchema.safeParse({
      ...ids,
      text: {},
      options: [option('A', { en: 'a' }), option('B', { en: 'b' })],
      correctOption: 'A',
    });
    expect(result.success).toBe(false);
  });
});

describe('availableLanguages', () => {
  it('only counts languages present in the stem and every option', () => {
    expect(
      availableLanguages({
        text: { en: 'Q?', ta: 'கேள்வி?' },
        options: [
          { key: 'A', text: { en: 'a', ta: 'அ' } },
          { key: 'B', text: { en: 'b' } },
        ],
      }),
    ).toEqual(['en']);
  });
});

describe('question status transitions', () => {
  it.each([
    ['draft', 'in_review', true],
    ['in_review', 'approved', true],
    ['approved', 'published', true],
    ['draft', 'published', false],
    ['published', 'draft', false],
    ['rejected', 'approved', false],
  ] as const)('%s -> %s is %s', (from, to, allowed) => {
    expect(canTransitionQuestion(from, to)).toBe(allowed);
  });
});

describe('exam rules validation', () => {
  it('requires section question counts to add up to the total', () => {
    const result = examRulesSchema.safeParse({
      durationMinutes: 180,
      totalQuestions: 200,
      totalMarks: 300,
      marksPerQuestion: 1.5,
      sections: [
        { code: 'PART_A', name: { en: 'Part A' }, questionCount: 100, marks: 150 },
        { code: 'PART_B', name: { en: 'Part B' }, questionCount: 90, marks: 135 },
      ],
    });
    expect(result.success).toBe(false);
  });
});
