import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const fontStack = `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: ${fontStack};

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: ${spin} 0.8s linear infinite;
  margin: 0 auto 1.5rem;
`;

export const LoadingText = styled.div`
  color: #6b7280;
  font-size: 1.125rem;
  font-weight: 500;
  text-align: center;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

export const Card = styled.div`
  background: linear-gradient(to bottom right, #ffffff, #fafafa);
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.05);
  padding: 2.5rem;
  margin-bottom: 2rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: ${fadeIn} 0.6s ease-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px -1px rgba(0, 0, 0, 0.1),
      0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.05);
  }
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.5rem;
  font-family: ${fontStack};
`;

export const Title = styled.h1`
  font-size: 2.25rem;
  text-align: center;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.2;
  font-family: ${fontStack};
`;

export const Subtitle = styled.h2`
  font-size: 1.25rem;
  text-align: center;
  color: #4b5563;
  font-weight: 500;
  margin-bottom: 1rem;
  line-height: 1.4;
  font-family: ${fontStack};
`;

export const QuestionTitle = styled.h3`
  font-size: 1.25rem;
  color: #1a1a1a;
  margin-bottom: 2rem;
  line-height: 1.4;
  font-family: ${fontStack};
  font-weight: 600;
`;

export const ProgressContainer = styled.div`
  width: 100%;
  margin-bottom: 2.5rem;
  font-family: ${fontStack};
`;

export const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 0.5rem;
  background-color: #f3f4f6;
  border-radius: 9999px;
  overflow: hidden;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${({ progress }) => `${progress}%`};
    background: linear-gradient(to right, #3b82f6, #2563eb);
    transition: width 0.5s ease;
  }
`;

export const ProgressText = styled.p`
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.75rem;
  font-weight: 500;
`;

export const AnswerButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-family: ${fontStack};
`;

export const AnswerButton = styled.button`
  padding: 1.25rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 1rem;
  text-align: left;
  font-weight: 500;
  color: #374151;
  transition: all 0.2s ease;
  font-family: ${fontStack};

  &:hover {
    background-color: #f8fafc;
    border-color: #3b82f6;
    transform: translateY(-1px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    border-color: #3b82f6;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-family: ${fontStack};
`;

export const ResultsTitle = styled.h2`
  font-size: 1.75rem;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  font-weight: 700;
  line-height: 1.3;
  font-family: ${fontStack};
`;

export const ResultsList = styled.ul`
  list-style: none;
  margin: 2rem 0;
  padding: 0;
  width: 100%;
`;

export const ResultsItem = styled.li`
  font-size: 1.125rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(to right, #eef2ff, #e0e7ff);
  color: #4338ca;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  font-weight: 500;
  transition: transform 0.2s ease;
  font-family: ${fontStack};

  &:hover {
    transform: translateX(4px);
  }
`;

export const Button = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(to right, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
  transition: all 0.2s ease;
  margin-top: 1.5rem;
  font-family: ${fontStack};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
`;

export const ErrorMessage = styled.div`
  color: #dc2626;
  background: linear-gradient(to right, #fee2e2, #fecaca);
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 500;
  font-family: ${fontStack};
`;
