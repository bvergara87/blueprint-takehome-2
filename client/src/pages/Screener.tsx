import React, { useState, useEffect } from "react";
import {
  Screener as ScreenerType,
  Answer,
  ScoreResult,
} from "../types/screener.types";
import { fetchScreener, submitAnswers } from "../services/api.service";
import {
  Loading,
  Error,
  Preview,
  QuestionScreen,
  ResultsScreen,
} from "../components/screener";

const ScreenerPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [screener, setScreener] = useState<ScreenerType | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [results, setResults] = useState<ScoreResult | null>(null);

  useEffect(() => {
    const loadScreener = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchScreener();
        setScreener(data);
      } catch (err) {
        setError("Failed to load the screener. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadScreener();
  }, []);

  const handleAnswer = (value: number) => {
    if (!screener) return;

    const section = screener.content.sections[0]; // We only have one section in this example
    const question = section.questions[currentQuestionIndex];

    const answer: Answer = {
      value,
      question_id: question.question_id,
    };

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    // If this was the last question, submit the answers
    if (
      currentQuestionIndex === section.questions.length - 1 &&
      currentSectionIndex === screener.content.sections.length - 1
    ) {
      handleSubmit(newAnswers);
    } else {
      // Otherwise, move to the next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async (answersToSubmit: Answer[]) => {
    try {
      setLoading(true);
      setError(null);
      const result = await submitAnswers(answersToSubmit);
      setResults(result);
    } catch (err) {
      setError("Failed to submit your answers. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(-1);
    setAnswers([]);
    setResults(null);
  };

  // Render appropriate component based on current state
  if (loading && !screener) {
    return <Loading />;
  }

  if (error || !screener) {
    return <Error message={error || "Failed to load the screener."} />;
  }

  // Show preview page if the screener hasn't started yet
  if (currentQuestionIndex === -1) {
    return (
      <Preview screener={screener} onStart={() => setCurrentQuestionIndex(0)} />
    );
  }

  if (results) {
    return (
      <ResultsScreen
        screener={screener}
        results={results}
        onReset={handleReset}
      />
    );
  }

  // Show the question screen
  return (
    <QuestionScreen
      screener={screener}
      currentSectionIndex={currentSectionIndex}
      currentQuestionIndex={currentQuestionIndex}
      onAnswer={handleAnswer}
    />
  );
};

export default ScreenerPage;
