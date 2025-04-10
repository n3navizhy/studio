'use client';

import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useEffect, useState} from "react";
import {generatePythonProblem} from "@/ai/flows/generate-python-problem";
import {Textarea} from "@/components/ui/textarea";
import {evaluateCodeAndProvideFeedback} from "@/ai/flows/evaluate-code-and-provide-feedback";
import {generateHintBasedOnCode} from "@/ai/flows/generate-hint-based-on-code";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Icons} from "@/components/icons";

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
    setStudentCode('');
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
    generateProblem();
  }, []);

  return (
    
      <SidebarProvider>
        
          
            
              
                PyGenius
                Раскройте свой потенциал в Python
              
            
            
              
                
                  
                    <Icons.plusCircle className="mr-2 h-4 w-4"/>
                    <span>Сгенерировать новую задачу</span>
                  
                
              
            
            
              
                
                  <AvatarImage src="https://picsum.photos/50/50" alt="Аватар"/>
                  <AvatarFallback>АБ</AvatarFallback>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="ml-auto h-8 w-8 p-0">
                      <span className="sr-only">Открыть меню пользователя</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Button variant={'link'} onClick={() => alert('Будущий профиль')}>Мой Профиль</Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              
            
          
        

        
          
            
              
                Задача
                Решите следующую задачу на Python
              
              
                {problem ? (
                  
                    
                      Описание:
                      {problem.problemDescription}
                      
                      Концепция:
                      {problem.problemConcept}
                      
                      Сложность:
                      {problem.difficultyLevel}
                    
                  
                ) : (
                  
                    Загрузка задачи...
                  
                )}
              
            
            
              
                Редактор Кода
                Напишите свой код Python здесь
              
              
                <Textarea
                  className="w-full"
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                />
                
                  Оценить Код
                  Получить Подсказку
                
              
            
            
              
                Обратная Связь
                Оценка на основе AI
              
              
                {feedback ? (
                  
                    {feedback}
                  
                ) : (
                  
                    Пока нет обратной связи. Отправьте свой код на оценку.
                  
                )}
                {hint ? (
                  
                    
                      Подсказка:
                      {hint}
                    
                  
                ) : null}
              
            
          
        
      
    
  );
}
