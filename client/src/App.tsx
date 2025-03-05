import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalStyle } from "./styles/global.styles";
import Screener from "./pages/Screener";

const App: React.FC = () => {
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Screener />} />
      </Routes>
    </Router>
  );
};

export default App;
