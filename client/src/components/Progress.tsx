import React from "react";
import {
  ProgressContainer,
  ProgressBar,
  ProgressText,
} from "../styles/components.styles";

interface ProgressProps {
  currentQuestion: number;
  totalQuestions: number;
}

const Progress: React.FC<ProgressProps> = ({
  currentQuestion,
  totalQuestions,
}) => {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <ProgressContainer>
      <ProgressBar progress={progress} />
      <ProgressText>
        Question {currentQuestion} of {totalQuestions}
      </ProgressText>
    </ProgressContainer>
  );
};

export default Progress;
