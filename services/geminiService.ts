

// import { FinalReport } from "../types"; 

// // MOCK DATA
// const MOCK_DATA_RAW = {
//   "candidate_score": 75,
//   "verdict": "HIRE",
//   "overall_summary": "The candidate has successfully implemented a standalone Python script...",
//   "rule_compliance_decision": "The candidate has met most of the core requirements...",
//   "key_takeaways": "- Security Vulnerability: The use of eval()...",
//   "detailed_findings": [
//     {
//       "category": "SECURITY_RISK" as const,
//       "statement": "The get_rules method uses eval().",
//       "file_name": "src/database/data_store.py",
//       "line_start": 146,
//       "line_end": 155,
//       "suggestion": "Replace eval() with ast.literal_eval",
//       "code_snippet": "rule_dict['conditions'] = eval(rule_dict['conditions'])",
//       "line_numbers": "L146-155"
//     }
//   ]
// };

// export const generateReview = async (repoUrl: string): Promise<FinalReport> => {
//     const data = MOCK_DATA_RAW;
//     const isHired = data.verdict.toLowerCase().includes('hire') && !data.verdict.toLowerCase().includes('no');
    
//     return {
//       repoUrl: repoUrl || "https://github.com/binaryash/gmail-rulemaster",
//       candidate_score: data.candidate_score,
//       verdict: data.verdict,
//       overall_summary: data.overall_summary,
//       rule_compliance_decision: data.rule_compliance_decision,
//       key_takeaways: data.key_takeaways,
//       detailed_findings: data.detailed_findings,
//       hired: isHired
//     };
// };

import { FinalReport } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const generateReview = async (repoUrl: string): Promise<FinalReport> => {
  try {
    console.log('📤 Sending request to backend:', `/api/review`);
    
    const response = await fetch(`/api/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        repo_url: repoUrl
      })
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    console.log('📥 Received response from backend:', data);
    console.log('📊 Candidate Score:', data.candidate_score);
    console.log('✅ Verdict:', data.verdict);

    const isHired = data.verdict?.toLowerCase().includes('hire') && 
                    !data.verdict?.toLowerCase().includes('no hire');

    const finalReport = {
      repoUrl: repoUrl,
      candidate_score: data.candidate_score || 0,
      verdict: data.verdict || 'PENDING',
      overall_summary: data.overall_summary || '',
      rule_compliance_decision: data.rule_compliance_decision || '',
      key_takeaways: data.key_takeaways || '',
      detailed_findings: data.detailed_findings || [],
      hired: isHired
    };

    console.log('📋 Final Report to display:', finalReport);
    
    return finalReport;

  } catch (error) {
    console.error('❌ Error fetching review from backend:', error);
    throw error;
  }
};