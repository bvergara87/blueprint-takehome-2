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
          <Subtitle>About this Assessment</Subtitle>
        </Header>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ marginBottom: "1rem" }}>
            This screener is designed to help assess symptoms related to{" "}
            {screener.disorder}.
          </p>
          <p style={{ marginBottom: "1rem" }}>
            You will be presented with a series of{" "}
            {screener.content.sections[0].questions.length} questions about your
            experiences. Your answers will help determine if you might benefit
            from further evaluation.
          </p>
          <p style={{ marginBottom: "2rem" }}>
            This is not a diagnostic tool, but rather a first step in
            understanding your mental health needs. The results should be
            discussed with a qualified healthcare professional.
          </p>
          <Button onClick={onStart}>Begin Assessment</Button>
        </div>
      </Card>
    </Container>
  );
};

export default Preview;
