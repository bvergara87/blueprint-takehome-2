import React from "react";
import { Container, Card, Header, Title } from "../../styles/components.styles";

const Loading: React.FC = () => {
  return (
    <Container>
      <Card>
        <Header>
          <Title>Loading...</Title>
        </Header>
      </Card>
    </Container>
  );
};

export default Loading;
