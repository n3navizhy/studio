'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Icons} from '@/components/icons';
import CodeEditor from '@/components/code-editor';
import {useEffect, useState} from 'react';
import {generatePythonProblem} from '@/ai/flows/generate-python-problem';
import {evaluateCodeAndProvideFeedback} from '@/ai/flows/evaluate-code-and-provide-feedback';
import {generateHintBasedOnCode} from '@/ai/flows/generate-hint-based-on-code';

export default function Home() {
  const [problem, setProblem] = useState<any>(null);
  const [studentCode, setStudentCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [hint, setHint] = useState('');
  const [studentAge, setStudentAge] = useState(11);
  const [studentSkillLevel, setStudentSkillLevel] = useState('beginner');

  const generateProblem = async () => {
    const newProblem = await generatePythonProblem({
      studentAge: studentAge,
      studentSkillLevel: studentSkillLevel,
    });
    setProblem(newProblem);
    localStorage.setItem('problem', JSON.stringify(newProblem));
    setStudentCode('');
    localStorage.removeItem('studentCode');
    setFeedback('');
    setHint('');
  };

  const evaluateCode = async () => {
    if (problem) {
      const evaluation = await evaluateCodeAndProvideFeedback({
        code: studentCode,
        problemDescription: problem.problemDescription,
        testCases: problem.testCases,
      });
      setFeedback(evaluation.feedback);
    }
  };

  const getHint = async () => {
    if (problem) {
      const hintResponse = await generateHintBasedOnCode({
        problemDescription: problem.problemDescription,
        studentCode: studentCode,
      });
      setHint(hintResponse.hint);
    }
  };

  useEffect(() => {
    const storedProblem = localStorage.getItem('problem');
    if (storedProblem) {
      setProblem(JSON.parse(storedProblem));
    } else {
      generateProblem();
    }

    const storedCode = localStorage.getItem('studentCode');
    if (storedCode) {
      setStudentCode(storedCode);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('studentCode', studentCode);
  }, [studentCode]);

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarHeader>
            PuskSchool
            <br />
            Раскройте свой потенциал в Python
          </SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={generateProblem}>
                <Icons.plusCircle className="mr-2 h-4 w-4" />
                <span>Сгенерировать новую задачу</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>

        <div className="flex-1 p-4">
          <Card>
            <CardHeader>
              <CardTitle>Задача</CardTitle>
              <CardDescription>Решите следующую задачу на Python</CardDescription>
            </CardHeader>
            <CardContent>
              {problem ? (
                <>
                  <div>
                    Описание: {problem.problemDescription}
                    <br />
                    Концепция: {problem.problemConcept}
                    <br />
                    Сложность: {problem.difficultyLevel}
                  </div>
                </>
              ) : (
                <div>Загрузка задачи...</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Редактор Кода</CardTitle>
              <CardDescription>Напишите свой код Python здесь</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeEditor code={studentCode} onChange={setStudentCode} />
              <div className="mt-2 flex gap-2">
                <Button onClick={evaluateCode}>Оценить Код</Button>
                <Button variant="secondary" onClick={getHint}>
                  Получить Подсказку
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Обратная Связь</CardTitle>
              <CardDescription>Оценка на основе AI</CardDescription>
            </CardHeader>
            <CardContent>
              {feedback ? (
                <div>{feedback}</div>
              ) : (
                <div>Пока нет обратной связи. Отправьте свой код на оценку.</div>
              )}
              {hint ? (
                <div>
                  <br />
                  Подсказка: {hint}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
}
