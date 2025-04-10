// use server'
'use server';
/**
 * @fileOverview Generates Python coding problems tailored to students aged 11-17.
 *
 * - generatePythonProblem - A function that handles the problem generation process.
 * - GeneratePythonProblemInput - The input type for the generatePythonProblem function.
 * - GeneratePythonProblemOutput - The return type for the generatePythonProblem function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GeneratePythonProblemInputSchema = z.object({
  studentAge: z.number().describe('The age of the student (11-17).'),
  studentSkillLevel: z.string().describe('The skill level of the student (e.g., beginner, intermediate, advanced).'),
});
export type GeneratePythonProblemInput = z.infer<typeof GeneratePythonProblemInputSchema>;

const GeneratePythonProblemOutputSchema = z.object({
  problemDescription: z.string().describe('The description of the Python coding problem.'),
  problemConcept: z.string().describe('The primary programming concept covered by the problem'),
  difficultyLevel: z.string().describe('The difficulty level of the problem (easy, medium, hard)'),
  testCases: z.string().describe('Example test cases for the problem, in plain text format'),
});
export type GeneratePythonProblemOutput = z.infer<typeof GeneratePythonProblemOutputSchema>;

export async function generatePythonProblem(input: GeneratePythonProblemInput): Promise<GeneratePythonProblemOutput> {
  return generatePythonProblemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePythonProblemPrompt',
  input: {
    schema: z.object({
      studentAge: z.number().describe('The age of the student (11-17).'),
      studentSkillLevel: z.string().describe('The skill level of the student (e.g., beginner, intermediate, advanced).'),
    }),
  },
  output: {
    schema: z.object({
      problemDescription: z.string().describe('The description of the Python coding problem.'),
      problemConcept: z.string().describe('The primary programming concept covered by the problem'),
      difficultyLevel: z.string().describe('The difficulty level of the problem (easy, medium, hard)'),
      testCases: z.string().describe('Example test cases for the problem, in plain text format'),
    }),
  },
  prompt: `You are an AI coding problem generator for Python, tasked with creating problems tailored to students aged 11-17.

  Consider the student's age and skill level when generating the problem.
  The student is {{studentAge}} years old and their skill level is {{studentSkillLevel}}.

  The problem description should be clear, concise, and engaging.
  The problem concept should be relevant to the student's skill level.
  Set difficulty level to easy, medium, or hard.
  Generate plain-text test cases to run the problem.

  Ensure that the generated problem is appropriate and challenging for the student's age and skill level.

  Format the test cases as plain text, with each test case on a new line.
  `,
});

const generatePythonProblemFlow = ai.defineFlow<
  typeof GeneratePythonProblemInputSchema,
  typeof GeneratePythonProblemOutputSchema
>({
  name: 'generatePythonProblemFlow',
  inputSchema: GeneratePythonProblemInputSchema,
  outputSchema: GeneratePythonProblemOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
}
);
