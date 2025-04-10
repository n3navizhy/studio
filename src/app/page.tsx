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
      <div className="flex h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="px-2">
              <CardTitle className="text-lg">PyGenius</CardTitle>
              <CardDescription>Unleash your Python potential</CardDescription>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={generateProblem}>
                  <Icons.plusCircle className="mr-2 h-4 w-4"/>
                  <span>Generate New Problem</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center space-x-2 px-2">
              <Avatar>
                <AvatarImage src="https://picsum.photos/50/50" alt="Avatar"/>
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="ml-auto h-8 w-8 p-0">
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Button variant={'link'} onClick={() => alert('Future home for profile')}>My Profile</Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Problem</CardTitle>
                <CardDescription>Solve the following Python problem</CardDescription>
              </CardHeader>
              <CardContent>
                {problem ? (
                  <>
                    <p className="font-bold">Description:</p>
                    <p>{problem.problemDescription}</p>
                    <br/>
                    <p className="font-bold">Concept:</p>
                    <p>{problem.problemConcept}</p>
                    <br/>
                    <p className="font-bold">Difficulty:</p>
                    <p>{problem.difficultyLevel}</p>
                  </>
                ) : (
                  <p>Loading problem...</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Code Editor</CardTitle>
                <CardDescription>Write your Python code here</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  className="w-full"
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                />
                <div className="mt-4 flex justify-between">
                  <Button onClick={evaluateCode}>Evaluate Code</Button>
                  <Button variant="secondary" onClick={getHint}>Get Hint</Button>
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Feedback</CardTitle>
                <CardDescription>AI-Powered Evaluation</CardDescription>
              </CardHeader>
              <CardContent>
                {feedback ? (
                  <p>{feedback}</p>
                ) : (
                  <p>No feedback yet. Submit your code for evaluation.</p>
                )}
                {hint ? (
                  <>
                    <br/>
                    <p className="font-bold">Hint:</p>
                    <p>{hint}</p>
                  </>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
