import { BrainCircuit, ShieldCheck, FileText } from 'lucide-react';
import { AgentDefinition } from './types';

export const AGENTS: AgentDefinition[] = [
  {
    id: 'business_logic',
    name: 'Business Logic Agent',
    role: 'Core Architect',
    description: 'Analyzing the implementation of business requirements, rule processing logic, and algorithm efficiency.',
    icon: BrainCircuit,
    color: 'text-purple-500',
  },
  {
    id: 'qa',
    name: 'Quality Assurance Agent',
    role: 'Code Auditor',
    description: 'Scanning for security vulnerabilities, test coverage gaps, potential bugs, and code compliance issues.',
    icon: ShieldCheck,
    color: 'text-red-500',
  },
  {
    id: 'report',
    name: 'Reporter Agent',
    role: 'Finalizer',
    description: 'Synthesizing findings into a comprehensive hiring report with actionable insights and verdicts.',
    icon: FileText,
    color: 'text-blue-500',
  },
];

export const MOCK_REPORT_DELAY_MS = 1000; // Duration per agent (1 second)