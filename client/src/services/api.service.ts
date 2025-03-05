import { Screener, Answer, ScoreResult } from "../types/screener.types";

const API_URL = "http://localhost:3000";

export const fetchScreener = async (): Promise<Screener> => {
  try {
    const response = await fetch(`${API_URL}/assessments/screener`);
    if (!response.ok) {
      throw new Error("Failed to fetch screener");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching screener:", error);
    throw error;
  }
};

export const submitAnswers = async (
  answers: Answer[]
): Promise<ScoreResult> => {
  try {
    const response = await fetch(`${API_URL}/assessments/score`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answers }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit answers");
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting answers:", error);
    throw error;
  }
};
