import { InterviewSummary } from "../../entities/InterviewSummary";

export interface PersistenceSummary {
  id: string;
  text: string;
  generatedText: string;
  touched: boolean;
}

export interface GatewaySummary {
  id: string;
  text: string;
  generatedText: string;
  touched: boolean;
}

export const serializeInterviewSummary = (
  summary: InterviewSummary
): GatewaySummary => ({
  id: summary.id,
  text: summary.text,
  generatedText: summary.generatedText,
  touched: summary.touched,
});

export const deserializeInterviewSummary = (
  summary: GatewaySummary | PersistenceSummary
): InterviewSummary => ({
  id: summary.id,
  text: summary.text,
  generatedText: summary.generatedText,
  touched: summary.touched,
});
