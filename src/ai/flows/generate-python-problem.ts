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
  prompt: `Ты - AI, генерирующий задачи по программированию на Python для школьников 11-17 лет.

  Учитывай возраст и уровень подготовки ученика при создании задачи.
  Ученику {{studentAge}} лет, и его уровень подготовки - {{studentSkillLevel}}.

  Описание задачи должно быть понятным, кратким и интересным.
  Концепция задачи должна соответствовать уровню подготовки ученика.
  Установи уровень сложности задачи: легкий, средний или сложный.
  Сгенерируй примеры тестов для проверки решения задачи.

  Убедись, что сгенерированная задача подходит и является сложной для возраста и уровня подготовки ученика.
  Сформулируй задачу, концепцию, уровень сложности и тесты на русском языке.

  Форматируй тесты в виде обычного текста, каждый тест на новой строке.
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
