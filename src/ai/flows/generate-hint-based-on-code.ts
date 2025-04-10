'use server';
/**
 * @fileOverview Generates hints for Python code based on the problem description and student's code.
 *
 * - generateHintBasedOnCode - A function that generates a hint for the given code and problem.
 * - GenerateHintBasedOnCodeInput - The input type for the generateHintBasedOnCode function.
 * - GenerateHintBasedOnCodeOutput - The return type for the generateHintBasedOnCode function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateHintBasedOnCodeInputSchema = z.object({
  problemDescription: z.string().describe('The description of the python coding problem.'),
  studentCode: z.string().describe('The current code written by the student.'),
});
export type GenerateHintBasedOnCodeInput = z.infer<typeof GenerateHintBasedOnCodeInputSchema>;

const GenerateHintBasedOnCodeOutputSchema = z.object({
  hint: z.string().describe('A helpful hint to guide the student towards the solution.'),
});
export type GenerateHintBasedOnCodeOutput = z.infer<typeof GenerateHintBasedOnCodeOutputSchema>;

export async function generateHintBasedOnCode(input: GenerateHintBasedOnCodeInput): Promise<GenerateHintBasedOnCodeOutput> {
  return generateHintBasedOnCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHintBasedOnCodePrompt',
  input: {
    schema: z.object({
      problemDescription: z.string().describe('The description of the python coding problem.'),
      studentCode: z.string().describe('The current code written by the student.'),
    }),
  },
  output: {
    schema: z.object({
      hint: z.string().describe('A helpful hint to guide the student towards the solution.'),
    }),
  },
  prompt: `Ты - опытный преподаватель Python, умеющий давать подсказки ученикам, не раскрывая ответа.

  Ученик работает над следующей проблемой:
  {{problemDescription}}

  Ученик написал следующий код:
  {{studentCode}}

  Предоставь одну, краткую подсказку, чтобы помочь ученику продвинуться вперед. Подсказка должна быть специфичной для кода ученика и описания проблемы. Не выдавай решение, но направь ученика к лучшему пониманию.
  Подсказка не должна превышать 50 слов.
  Убедись, что подсказка отображается в формате Markdown.

  Подсказка:`, 
});

const generateHintBasedOnCodeFlow = ai.defineFlow<
  typeof GenerateHintBasedOnCodeInputSchema,
  typeof GenerateHintBasedOnCodeOutputSchema
>({
  name: 'generateHintBasedOnCodeFlow',
  inputSchema: GenerateHintBasedOnCodeInputSchema,
  outputSchema: GenerateHintBasedOnCodeOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
