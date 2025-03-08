import React from "react";
import { Screener, ScoreResult } from "../../types/screener.types";
import {
  Container,
  Card,
  Header,
  Title,
  ResultsContainer,
  Button,
  ResultsList,
  ResultsItem,
  ResultsTitle,
} from "../../styles/components.styles";

interface ResultsScreenProps {
  screener: Screener;
  results: ScoreResult;
  onReset: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  screener,
  results,
  onReset,
}) => {
  return (
    <Container>
      <Card>
        <Header>
          <Title>{screener.full_name}</Title>
        </Header>
        <ResultsContainer>
          {results.results.length > 0 ? (
            <>
              <ResultsTitle>
                Based on your responses, we recommend the following assessments:
              </ResultsTitle>
              <ResultsList>
                {results.results.map((assessment) => (
                  <ResultsItem key={assessment}>{assessment}</ResultsItem>
                ))}
              </ResultsList>
            </>
          ) : (
            <p>No specific assessments recommended at this time.</p>
          )}

          <Button onClick={onReset}>Start Over</Button>
        </ResultsContainer>
      </Card>
    </Container>
  );
};

export default ResultsScreen;
