'use server';
/**
 * @fileOverview Evaluates the student's code against test cases and provides feedback.
 *
 * - evaluateCodeAndProvideFeedback - A function that evaluates the code and provides feedback.
 * - EvaluateCodeAndProvideFeedbackInput - The input type for the evaluateCodeAndProvideFeedback function.
 * - EvaluateCodeAndProvideFeedbackOutput - The return type for the evaluateCodeAndProvideFeedback function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {compileAndRun} from '@/services/compiler';

const EvaluateCodeAndProvideFeedbackInputSchema = z.object({
  code: z.string().describe('The Python code submitted by the student.'),
  problemDescription: z.string().describe('The description of the problem the student is solving.'),
  testCases: z.string().describe('The test cases for the problem, in the format of input/output pairs. Example: input: \'2 3\', output: \'5\'.'),
});
export type EvaluateCodeAndProvideFeedbackInput = z.infer<typeof EvaluateCodeAndProvideFeedbackInputSchema>;

const EvaluateCodeAndProvideFeedbackOutputSchema = z.object({
  feedback: z.string().describe('The feedback for the student, including whether the code passed the test cases and suggestions for improvement.'),
  passed: z.boolean().describe('Whether the code passed all test cases.'),
});
export type EvaluateCodeAndProvideFeedbackOutput = z.infer<typeof EvaluateCodeAndProvideFeedbackOutputSchema>;

export async function evaluateCodeAndProvideFeedback(
  input: EvaluateCodeAndProvideFeedbackInput
): Promise<EvaluateCodeAndProvideFeedbackOutput> {
  return evaluateCodeAndProvideFeedbackFlow(input);
}

const evaluateCodePrompt = ai.definePrompt({
  name: 'evaluateCodePrompt',
  input: {
    schema: z.object({
      code: z.string().describe('The Python code submitted by the student.'),
      problemDescription: z.string().describe('The description of the problem the student is solving.'),
      testCases: z.string().describe('The test cases for the problem, in the format of input/output pairs. Example: input: \'2 3\', output: \'5\'.'),
      compilationResult: z.object({
        output: z.string().describe('The output of the compiled code.'),
        errors: z.string().nullable().describe('Any errors that occurred during compilation or execution, or null if there were no errors.'),
      }).describe('The result of compiling and running the code.'),
    }),
  },
  output: {
    schema: z.object({
      feedback: z.string().describe('The feedback for the student, including whether the code passed the test cases and suggestions for improvement.'),
      passed: z.boolean().describe('Whether the code passed all test cases.'),
    }),
  },
  prompt: `Ты - AI, оценивающий код. Ты получишь код ученика, описание задачи, тесты и результат компиляции и выполнения кода.

Ты должен оценить код на соответствие тестам и предоставить обратную связь ученику. Обратная связь должна быть действенной и помогать ученику выявлять и исправлять свои ошибки.

Описание задачи: {{{problemDescription}}}

Тесты: {{{testCases}}}

Результат компиляции: {{{compilationResult}}}

Код: {{{code}}}

Укажи, прошел ли код все тесты. Если нет, предоставь конкретную информацию о том, какие тесты не пройдены и почему. Также предоставь общие предложения по улучшению, сосредоточив внимание на стиле кодирования, эффективности и потенциальных ошибках.
`,
});

const evaluateCodeAndProvideFeedbackFlow = ai.defineFlow<
  typeof EvaluateCodeAndProvideFeedbackInputSchema,
  typeof EvaluateCodeAndProvideFeedbackOutputSchema
>(
  {
    name: 'evaluateCodeAndProvideFeedbackFlow',
    inputSchema: EvaluateCodeAndProvideFeedbackInputSchema,
    outputSchema: EvaluateCodeAndProvideFeedbackOutputSchema,
  },
  async input => {
    const compilationResult = await compileAndRun(input.code);

    const {output} = await evaluateCodePrompt({
      ...input,
      compilationResult,
    });

    return output!;
  }
);
