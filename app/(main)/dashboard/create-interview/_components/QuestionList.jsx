"use client";
import { useUser } from "@/app/provider";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2Icon, PlusIcon, Trash2Icon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/services/supabaseClient";

function QuestionList({ formData, onCreateLink }) {
  const [loading, setLoading] = useState(true);
  const [questionList, setQuestionList] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newQuestionType, setNewQuestionType] = useState("behavioral");
  const { user } = useUser();
  const hasCalled = useRef(false);

  // Debugging useEffect - logs whenever questionList changes
  useEffect(() => {
    console.log("Current questionList state:", questionList);
  }, [questionList]);

  useEffect(() => {
    if (formData && !hasCalled.current) {
      console.log("Initial formData received:", formData);
      GenerateQuestionList();
    }
  }, [formData]);

  const GenerateQuestionList = async () => {
    setLoading(true);
    hasCalled.current = true;
    try {
      console.log("Making API call to generate questions...");
      const result = await axios.post("/api/ai-model", {
        ...formData,
      });

      console.log("API response received:", result.data);

      const rawContent = result?.data?.content || result?.data?.Content;

      if (!rawContent) {
        toast("Invalid response format");
        console.error('Missing "content" or "Content" field in response');
        return;
      }

      const match = rawContent.match(/```json\s*([\s\S]*?)\s*```/);

      if (!match || !match[1]) {
        toast("Failed to extract question list");
        console.error("No valid JSON block found in response");
        return;
      }

      const parsedData = JSON.parse(match[1].trim());
      console.log("Parsed question data:", parsedData);
      setQuestionList(parsedData);
    } catch (e) {
      toast("Server Error, Try Again");
      console.error("Error generating questions:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) {
      toast("Please enter a question");
      return;
    }

    console.log("Attempting to add new question:", {
      question: newQuestion,
      type: newQuestionType
    });

    setQuestionList(prev => {
      if (!prev || !prev.interviewQuestions) {
        console.error("Invalid previous state:", prev);
        return prev;
      }

      const newQuestionObj = {
        question: newQuestion,
        type: newQuestionType
      };

      const newState = {
        ...prev,
        interviewQuestions: [...prev.interviewQuestions, newQuestionObj]
      };

      console.log("New state after addition:", newState);
      return newState;
    });

    setNewQuestion("");
    setNewQuestionType("behavioral");
    toast("Question added successfully");
  };

  const handleDeleteQuestion = (index) => {
    console.log("Attempting to delete question at index:", index);

    setQuestionList(prev => {
      if (!prev || !prev.interviewQuestions || index >= prev.interviewQuestions.length) {
        console.error("Invalid deletion index or state:", { index, state: prev });
        return prev;
      }

      const updatedQuestions = [...prev.interviewQuestions];
      updatedQuestions.splice(index, 1);

      const newState = {
        ...prev,
        interviewQuestions: updatedQuestions
      };

      console.log("New state after deletion:", newState);
      return newState;
    });

    toast("Question deleted successfully");
  };

  const onFinish = async () => {
    setSaveLoading(true);
    const interview_id = uuidv4();

    console.log("Final question list being saved:", questionList);
    console.log("Form data being saved:", formData);

    try {
      const { data, error } = await supabase
        .from("Interviews")
        .insert([
          {
            ...formData,
            questionList: questionList,
            userEmail: user?.email,
            interview_id: interview_id,
          },
        ])
        .select();

      console.log("Supabase insert result:", { data, error });

      const userUpdate = await supabase
        .from("Users")
        .update({ credits: Number(user?.credits) - 1 })
        .eq("email", user?.email)
        .select();

      console.log("User credit update result:", userUpdate);

      setSaveLoading(false);
      onCreateLink(interview_id);

      if (error) {
        toast("Failed to save interview");
        console.error("Supabase error:", error);
      } else {
        toast("Interview saved successfully!");
      }
    } catch (e) {
      console.error("Error saving interview:", e);
      toast("Error saving interview");
      setSaveLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className="flex flex-col items-center gap-4 mt-10">
          <Loader2Icon className="animate-spin w-6 h-6 text-blue-500" />
          <div className="p-5 bg-blue-50 rounded-xl border border-gray-100 flex flex-col gap-2 items-center text-center">
            <h2 className="font-semibold text-lg">
              Generating Interview Questions
            </h2>
            <p className="text-sm text-gray-600">
              Our AI is crafting personalized questions based on your job position
            </p>
          </div>
        </div>
      )}

      {!loading && questionList && questionList.interviewQuestions && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Generated Questions
          </h2>
          
          {/* Add Question Form */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3">Add Custom Question</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Enter your question"
                className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <select
                value={newQuestionType}
                onChange={(e) => setNewQuestionType(e.target.value)}
                className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="behavioral">Behavioral</option>
                <option value="technical">Technical</option>
                <option value="situational">Situational</option>
                <option value="cultural">Cultural Fit</option>
              </select>
              <Button 
                onClick={handleAddQuestion}
                className="flex items-center gap-1"
              >
                <PlusIcon className="w-4 h-4" />
                Add Question
              </Button>
            </div>
          </div>
          
          {/* Questions List */}
          <div className="space-y-4">
            {questionList.interviewQuestions.map((item, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-white shadow-sm flex justify-between items-start"
              >
                <div>
                  <p className="font-medium">
                    {index + 1}. {item.question}
                  </p>
                  <p className="text-sm text-primary">Type: {item.type}</p>
                </div>
                <button
                  onClick={() => handleDeleteQuestion(index)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                  aria-label="Delete question"
                >
                  <Trash2Icon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-10">
            <Button onClick={onFinish} disabled={saveLoading}>
              {saveLoading ? (
                <>
                  <Loader2Icon className="animate-spin w-4 h-4 mr-2" />
                  Saving...
                </>
              ) : (
                "Create Interview Link & Finish"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionList;