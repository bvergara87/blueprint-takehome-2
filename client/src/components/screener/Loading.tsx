import React from "react";
import {
  Container,
  Card,
  Header,
  LoadingSpinner,
  LoadingText,
} from "../../styles/components.styles";

const Loading: React.FC = () => {
  return (
    <Container>
      <Card>
        <Header>
          <LoadingSpinner />
          <LoadingText>Loading your assessment...</LoadingText>
        </Header>
      </Card>
    </Container>
  );
};

export default Loading;
