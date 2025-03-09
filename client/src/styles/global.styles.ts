import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    color: #1a1a1a;
    line-height: 1.6;
    min-height: 100vh;
    font-size: 16px;
  }

  button {
    cursor: pointer;
    font-family: inherit;
    border: none;
    outline: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    margin-bottom: 1rem;
    letter-spacing: -0.025em;
    line-height: 1.2;
  }

  p {
    margin-bottom: 1rem;
    font-size: 1rem;
    line-height: 1.6;
  }

  ::selection {
    background-color: #3b82f6;
    color: white;
  }

  @media (max-width: 768px) {
    html {
      font-size: 14px;
    }
  }
`;
