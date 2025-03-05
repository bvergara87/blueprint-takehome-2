import React from "react";
import { ScoreResult } from "../types/screener.types";
import {
  ResultsContainer,
  ResultsTitle,
  ResultsList,
  ResultsItem,
  Button,
} from "../styles/components.styles";

interface ResultsProps {
  results: ScoreResult;
  onReset: () => void;
}

const Results: React.FC<ResultsProps> = ({ results, onReset }) => {
  return (
    <ResultsContainer>
      <ResultsTitle>
        Based on your responses, we recommend the following assessments:
      </ResultsTitle>

      {results.results.length > 0 ? (
        <ResultsList>
          {results.results.map((assessment) => (
            <ResultsItem key={assessment}>{assessment}</ResultsItem>
          ))}
        </ResultsList>
      ) : (
        <p>No specific assessments recommended at this time.</p>
      )}

      <Button onClick={onReset}>Start Over</Button>
    </ResultsContainer>
  );
};

export default Results;
