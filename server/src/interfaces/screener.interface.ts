export interface Screener {
  id: string;
  name: string;
  disorder: string;
  content: {
    sections: Section[];
    display_name: string;
  };
  full_name: string;
}

export interface Section {
  type: string;
  title: string;
  answers: AnswerOption[];
  questions: Question[];
}

export interface AnswerOption {
  title: string;
  value: number;
}

export interface Question {
  question_id: string;
  title: string;
}
