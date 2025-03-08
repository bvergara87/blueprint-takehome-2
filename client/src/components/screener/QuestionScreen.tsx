import React from "react";
import { Screener } from "../../types/screener.types";
import Progress from "./Progress";
import Question from "./Question";
import {
  Container,
  Card,
  Header,
  Title,
  Subtitle,
} from "../../styles/components.styles";

interface QuestionScreenProps {
  screener: Screener;
  currentSectionIndex: number;
  currentQuestionIndex: number;
  onAnswer: (value: number) => void;
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({
  screener,
  currentSectionIndex,
  currentQuestionIndex,
  onAnswer,
}) => {
  const section = screener.content.sections[currentSectionIndex];
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
          onAnswer={onAnswer}
        />
      </Card>
    </Container>
  );
};

export default QuestionScreen;
