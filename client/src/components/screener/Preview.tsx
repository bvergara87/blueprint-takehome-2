import React from "react";
import { Screener } from "../../types/screener.types";
import {
  Container,
  Card,
  Header,
  Title,
  Subtitle,
  Button,
} from "../../styles/components.styles";

interface PreviewProps {
  screener: Screener;
  onStart: () => void;
}

const Preview: React.FC<PreviewProps> = ({ screener, onStart }) => {
  return (
    <Container>
      <Card>
        <Header>
          <Title>{screener.full_name}</Title>
        </Header>
        <div style={{ textAlign: "center" }}>
          <p style={{ marginBottom: "20px" }}>
            Welcome to the {screener.full_name} assessment.
          </p>
          <p style={{ marginBottom: "20px" }}>
            We're here to help you better understand your mental health and
            wellbeing.
          </p>
          <p style={{ marginBottom: "20px" }}>
            This brief questionnaire contains{" "}
            {screener.content.sections[0].questions.length} questions about your
            recent thoughts, feelings and experiences. Your honest responses
            will help us evaluate if additional mental health support might be
            beneficial for you.
          </p>
          <p style={{ marginBottom: "20px" }}>
            Rest assured that your privacy is our top priority. All of your
            responses are completely confidential and will never be shared with
            anyone without your explicit consent.
          </p>
          <Button onClick={onStart}>Begin Assessment</Button>
        </div>
      </Card>
    </Container>
  );
};

export default Preview;
