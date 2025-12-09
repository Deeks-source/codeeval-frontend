import React from 'react';

export interface AgentDefinition {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

export interface DetailedFinding {
  category: 'WEAKNESS' | 'SECURITY_RISK';
  statement: string;
  file_name: string;
  line_start: number;
  line_end: number;
  suggestion: string;
  code_snippet: string;
  line_numbers: string;
}

export interface FinalReport {
  repoUrl: string;
  candidate_score: number;
  verdict: string;
  overall_summary: string;
  rule_compliance_decision: string;
  key_takeaways: string; // The JSON provides this as a formatted string
  detailed_findings: DetailedFinding[];
  hired: boolean;
}

export enum AppState {
  IDLE = 'IDLE',
  SIMULATING = 'SIMULATING',
  REPORT_READY = 'REPORT_READY',
  ERROR = 'ERROR'
}