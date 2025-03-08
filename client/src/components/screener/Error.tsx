import React from "react";
import {
  Container,
  Card,
  Header,
  Title,
  ErrorMessage,
} from "../../styles/components.styles";

interface ErrorProps {
  message: string;
}

const Error: React.FC<ErrorProps> = ({ message }) => {
  return (
    <Container>
      <Card>
        <Header>
          <Title>Error</Title>
        </Header>
        <ErrorMessage>{message}</ErrorMessage>
      </Card>
    </Container>
  );
};

export default Error;
