import React, { useState, useEffect } from "react";
import {
  Screener as ScreenerType,
  Answer,
  ScoreResult,
} from "../types/screener.types";
import { fetchScreener, submitAnswers } from "../services/api.service";
import Progress from "../components/Progress";
import Question from "../components/Question";
import Results from "../components/Results";
import {
  Container,
  Card,
  Header,
  Title,
  Subtitle,
  ErrorMessage,
} from "../styles/components.styles";

const ScreenerPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [screener, setScreener] = useState<ScreenerType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
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
    if (currentQuestionIndex === section.questions.length - 1) {
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
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResults(null);
  };

  if (loading && !screener) {
    return (
      <Container>
        <Card>
          <Header>
            <Title>Loading...</Title>
          </Header>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Card>
          <Header>
            <Title>Error</Title>
          </Header>
          <ErrorMessage>{error}</ErrorMessage>
        </Card>
      </Container>
    );
  }

  if (!screener) {
    return (
      <Container>
        <Card>
          <Header>
            <Title>No screener available</Title>
          </Header>
        </Card>
      </Container>
    );
  }

  if (results) {
    return (
      <Container>
        <Card>
          <Header>
            <Title>{screener.full_name}</Title>
          </Header>
          <Results results={results} onReset={handleReset} />
        </Card>
      </Container>
    );
  }

  const section = screener.content.sections[0]; // We only have one section in this example
  const totalQuestions = section.questions.length;
  const currentQuestion = section.questions[currentQuestionIndex];

  return (
    <Container>
      <Card>
        <Header>
          <Title>{screener.content.display_name}</Title>
          <Subtitle>{section.title}</Subtitle>
        </Header>

        <Progress
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
        />

        <Question
          question={currentQuestion}
          answers={section.answers}
          onAnswer={handleAnswer}
        />
      </Card>
    </Container>
  );
};

export default ScreenerPage;
