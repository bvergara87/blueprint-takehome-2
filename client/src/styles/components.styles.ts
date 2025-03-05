import styled from "styled-components";

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const Card = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 2rem;
  margin-bottom: 2rem;
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 1.875rem;
  text-align: center;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

export const Subtitle = styled.h2`
  font-size: 1.25rem;
  text-align: center;
  color: #4b5563;
  font-weight: 400;
  margin-bottom: 1.5rem;
`;

export const QuestionTitle = styled.h3`
  font-size: 1.125rem;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;

export const ProgressContainer = styled.div`
  width: 100%;
  margin-bottom: 2rem;
`;

export const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 0.5rem;
  background-color: #e5e7eb;
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
    background-color: #3b82f6;
    transition: width 0.3s ease;
  }
`;

export const ProgressText = styled.p`
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

export const AnswerButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const AnswerButton = styled.button`
  padding: 1rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  text-align: left;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
    border-color: #9ca3af;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    border-color: #3b82f6;
  }
`;

export const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const ResultsTitle = styled.h2`
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 1rem;
`;

export const ResultsList = styled.ul`
  list-style: none;
  margin: 1.5rem 0;
  padding: 0;
`;

export const ResultsItem = styled.li`
  font-size: 1.125rem;
  padding: 0.75rem 1.5rem;
  background-color: #eef2ff;
  color: #4f46e5;
  border-radius: 0.375rem;
  margin-bottom: 0.75rem;
`;

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
`;

export const ErrorMessage = styled.div`
  color: #ef4444;
  background-color: #fee2e2;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;
