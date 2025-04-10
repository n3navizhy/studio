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
  prompt: `You are an expert Python tutor, skilled at giving hints to students without revealing the answer.

  A student is working on the following problem:
  {{problemDescription}}

  The student has written the following code:
  {{studentCode}}

  Provide a single, concise hint to help the student make progress. The hint should be specific to the student's code and the problem description. Do not give away the solution, but guide the student towards a better understanding.
  The hint should not exceed 50 words.
  Make sure the hint is displayed in markdown format.

  Hint:`, 
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
