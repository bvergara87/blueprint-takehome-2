import React from "react";
import { Question, AnswerOption } from "../types/screener.types";
import {
  QuestionTitle,
  AnswerButtonsContainer,
  AnswerButton,
} from "../styles/components.styles";

interface QuestionProps {
  question: Question;
  answers: AnswerOption[];
  onAnswer: (value: number) => void;
}

const QuestionComponent: React.FC<QuestionProps> = ({
  question,
  answers,
  onAnswer,
}) => {
  return (
    <div>
      <QuestionTitle>{question.title}</QuestionTitle>
      <AnswerButtonsContainer>
        {answers.map((answer) => (
          <AnswerButton
            key={answer.value}
            onClick={() => onAnswer(answer.value)}
          >
            {answer.title}
          </AnswerButton>
        ))}
      </AnswerButtonsContainer>
    </div>
  );
};

export default QuestionComponent;
