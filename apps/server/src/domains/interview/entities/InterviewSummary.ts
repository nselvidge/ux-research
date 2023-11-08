import { randomUUID } from "crypto";

export interface InterviewSummary {
  id: string;
  text: string;
  touched: boolean;
  generatedText: string;
}

export const createNewSummary = (
  text: string,
  isGenerated = true
): InterviewSummary => ({
  id: randomUUID(),
  text: text.trim(),
  touched: false,
  generatedText: isGenerated ? text : "",
});

export const updateSummary = (summary: InterviewSummary, text: string) => ({
  ...summary,
  text: text.trim(),
  touched: true,
});

export const addGeneratedSummary = (
  summary: InterviewSummary,
  text: string
) => ({
  ...summary,
  generatedText: text,
});
