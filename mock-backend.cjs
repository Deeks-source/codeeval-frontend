// mock-backend.js
// Simple mock backend server to test the frontend

const http = require('http');

const PORT = 8000;

// Mock data matching your backend response format
const mockResponse = {
  "candidate_score": 90,
  "verdict": "DEEKS IS HIRE",
  "overall_summary": "The candidate has successfully implemented a standalone Python script that connects to Gmail using the Gmail API and OAuth, fetches emails, stores them in a SQLite database, and processes them based on rules defined in a JSON file. The project demonstrates a good understanding of API integration, database management, and rule-based processing. The code is modular, with clear separation of concerns across different modules for authentication, data storage, email handling, and rule engine logic. The inclusion of a comprehensive README file is a significant strength, making the project easy to understand and set up.\n\nHowever, there are several areas for improvement. The most critical is the use of `eval()` for parsing rule conditions and actions, which poses a security risk. Additionally, the error handling for date parsing could be more robust, and there's a redundancy in authentication code across two files. The project also lacks automated test coverage, which is essential for ensuring reliability and maintainability. Addressing these points would significantly enhance the quality and security of the application.",
  "rule_compliance_decision": "The candidate has met most of the core requirements of the assignment, including connecting to Gmail, fetching and storing emails, and processing them based on rules. The code is generally well-organized and follows good practices like using parameterized queries for database operations. However, the use of `eval()` for parsing rule data is a significant deviation from secure coding practices and introduces a security risk. The lack of test coverage also falls short of the expectation for a robust solution. While the project is functional, these weaknesses prevent a 'Strong Hire' verdict.",
  "key_takeaways": "- **Security Vulnerability**: The use of `eval()` for parsing rule data is a critical security risk.\n- **Lack of Test Coverage**: The absence of automated tests makes it difficult to ensure the reliability and correctness of the application.\n- **Code Redundancy**: Duplicate authentication logic exists in `auth_manager.py` and `src/auth/gmail_auth.py`.\n- **Error Handling**: Date parsing and other potential errors could be handled more gracefully.\n- **Extensibility**: While the rule structure allows for adding conditions, the hardcoded folder names in `move_to_folder` could be improved.",
  "detailed_findings": [
    {
      "category": "SECURITY_RISK",
      "statement": "The `get_rules` method in `data_store.py` uses `eval()` to parse stored rule conditions and actions. This is a security risk as it can execute arbitrary code if the data in the database is compromised or maliciously crafted.",
      "file_name": "src/database/data_store.py",
      "line_start": 146,
      "line_end": 155,
      "highlighted_lines": [149, 150],
      "suggestion": "Replace `eval()` with `ast.literal_eval` for safer evaluation of literal Python expressions.\n```python\nimport ast\n\n# ... inside get_rules method\nrule_dict[\"conditions\"] = ast.literal_eval(rule_dict[\"conditions\"])\nrule_dict[\"actions\"] = ast.literal_eval(rule_dict[\"actions\"])\n```",
      "code_snippet": "for row in cursor.fetchall():\n    rule_dict = dict(row)\n    try:\n        # Convert string representations back to lists/dicts\n        rule_dict['conditions'] = eval(rule_dict['conditions'])\n        rule_dict['actions'] = eval(rule_dict['actions'])\n    except (SyntaxError, ValueError) as e:\n        print(f\"Error parsing rule data: {e}\")\n        continue\n    rules.append(rule_dict)",
      "line_numbers": "L146-155"
    },
    {
      "category": "WEAKNESS",
      "statement": "The project is missing a dedicated test suite. The absence of tests means that the functionality of authentication, data storage, and rule processing has not been verified through automated tests.",
      "file_name": "None",
      "line_start": 0,
      "line_end": 0,
      "suggestion": "Create a `tests/` directory and implement unit and integration tests for key components such as `GmailAuthManager`, `EmailDataStore`, and `RuleEngine`. Ensure tests cover various scenarios, including edge cases and error handling.",
      "code_snippet": "Code location not specified by Agent.",
      "line_numbers": "Unknown"
    },
    {
      "category": "WEAKNESS",
      "statement": "The `_parse_date` method in `email_handler.py` has a fallback to `datetime.now()` if date parsing fails, which might lead to incorrect `received_date` values being stored and used in rule evaluations.",
      "file_name": "src/email/email_handler.py",
      "line_start": 91,
      "line_end": 98,
      "highlighted_lines": [93, 96],
      "suggestion": "Instead of falling back to `datetime.now()`, it's better to log the error and potentially return `None` or raise a specific exception to indicate that the date could not be parsed. This ensures that invalid dates do not silently corrupt the data.\n```python\nexcept Exception as e:\n    print(f\"Error parsing date string '{date_str}': {e}\")\n    # Return None or raise a custom exception to indicate failure\n    return None\n```",
      "code_snippet": "continue\n\n# Fallback to current datetime if parsing fails\nreturn datetime.now()\nexcept Exception:\n    return datetime.now()\n\ndef mark_as_read(self, message_id: str) -> bool:",
      "line_numbers": "L91-98"
    },
    {
      "category": "SECURITY_RISK",
      "statement": "The `token.pickle` file is used to store authentication tokens. While convenient, pickle files can be vulnerable to deserialization attacks if not handled with extreme care, potentially leading to unauthorized access.",
      "file_name": "src/auth/gmail_auth.py",
      "line_start": 22,
      "line_end": 27,
      "highlighted_lines": [24,26],
      "suggestion": "Consider more secure methods for storing sensitive tokens, such as using environment variables for credentials and a secure token store or encrypted storage for refresh tokens. If pickle must be used, ensure the file has strict permissions and is not accessible by unauthorized users.",
      "code_snippet": "'https://www.googleapis.com/auth/gmail.labels'\n]\nself.credentials_path = 'credentials.json'\nself.token_path = 'token.pickle'\n\ndef _load_saved_credentials(self):",
      "line_numbers": "L22-27"
    }
  ]
};

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle POST request to /api/review
  if (req.url === '/api/review' && req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log(`\n✅ Received review request for: ${data.repo_url}`);
        console.log('⏳ Simulating backend processing (3 seconds)...\n');

        // Simulate processing delay
        setTimeout(() => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(mockResponse));
          console.log('✅ Sent mock response to frontend\n');
        }, 3000); // 3 second delay to simulate real processing

      } catch (error) {
        console.error('❌ Error parsing request:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log('🚀 Mock Backend Server Running');
  console.log(`📍 Listening on: http://localhost:${PORT}`);
  console.log(`📡 Endpoint: POST http://localhost:${PORT}/api/review`);
  console.log('\n✨ Ready to receive requests from frontend!\n');
});