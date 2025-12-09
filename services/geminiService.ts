import { GoogleGenAI } from "@google/genai";
import { FinalReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// EXACT MOCK DATA FROM PROMPT
const MOCK_DATA_RAW = {
  "candidate_score": 75,
  "verdict": "HIRE",
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
      "suggestion": "Replace `eval()` with `ast.literal_eval` for safer evaluation of literal Python expressions.\n```python\nimport ast\n\n# ... inside get_rules method\nrule_dict[\"conditions\"] = ast.literal_eval(rule_dict[\"conditions\"])\nrule_dict[\"actions\"] = ast.literal_eval(rule_dict[\"actions\"])\n```",
      "code_snippet": "            for row in cursor.fetchall():\n                rule_dict = dict(row)\n                try:\n                    # Convert string representations back to lists/dicts\n                    rule_dict['conditions'] = eval(rule_dict['conditions'])\n                    rule_dict['actions'] = eval(rule_dict['actions'])\n                except (SyntaxError, ValueError) as e:\n                    print(f\"Error parsing rule data: {e}\")\n                    continue\n                rules.append(rule_dict)",
      "line_numbers": "L146-155"
    },
    {
      "category": "SECURITY_RISK",
      "statement": "The `eval()` function is used to parse string representations of conditions and actions from the database. This is a security risk as it can execute arbitrary code if the data in the database is compromised or maliciously crafted.",
      "file_name": "data_store.py",
      "line_start": 146,
      "line_end": 155,
      "suggestion": "Replace `eval()` with `ast.literal_eval` for safer evaluation of literal Python expressions.\n```python\nimport ast\n\n# ... inside get_rules method\nrule_dict[\"conditions\"] = ast.literal_eval(rule_dict[\"conditions\"])\nrule_dict[\"actions\"] = ast.literal_eval(rule_dict[\"actions\"])\n```",
      "code_snippet": "            for row in cursor.fetchall():\n                rule_dict = dict(row)\n                try:\n                    # Convert string representations back to lists/dicts\n                    rule_dict['conditions'] = eval(rule_dict['conditions'])\n                    rule_dict['actions'] = eval(rule_dict['actions'])\n                except (SyntaxError, ValueError) as e:\n                    print(f\"Error parsing rule data: {e}\")\n                    continue\n                rules.append(rule_dict)",
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
      "suggestion": "Instead of falling back to `datetime.now()`, it's better to log the error and potentially return `None` or raise a specific exception to indicate that the date could not be parsed. This ensures that invalid dates do not silently corrupt the data.\n```python\n        except Exception as e:\n            print(f\"Error parsing date string '{date_str}': {e}\")\n            # Return None or raise a custom exception to indicate failure\n            return None\n```",
      "code_snippet": "                    continue\n            \n            # Fallback to current datetime if parsing fails\n            return datetime.now()\n        except Exception:\n            return datetime.now()\n    \n    def mark_as_read(self, message_id: str) -> bool:",
      "line_numbers": "L91-98"
    },
    {
      "category": "WEAKNESS",
      "statement": "The `_check_condition` method in `rule_engine.py` directly uses `int(value)` for date comparisons without robust error handling for non-integer inputs, which could lead to `ValueError` exceptions.",
      "file_name": "src/rules/rule_engine.py",
      "line_start": 70,
      "line_end": 77,
      "suggestion": "Add a try-except block around the `int(value)` conversion to handle potential `ValueError` if the 'value' for date comparisons is not a valid integer. This improves the robustness of the rule evaluation.\n```python\ntry:\n    days_to_compare = int(value)\n    if operation == 'is less than':\n        return days_old < days_to_compare\n    elif operation == 'is greater than':\n        return days_old > days_to_compare\nexcept ValueError:\n    print(f\"Invalid integer value for date comparison: {value}\")\n    return False\n```",
      "code_snippet": "                days_old = (datetime.now() - field_value).days\n                \n                if operation == 'is less than':\n                    return days_old < int(value)\n                elif operation == 'is greater than':\n                    return days_old > int(value)\n            except (ValueError, TypeError):\n                return False",
      "line_numbers": "L70-77"
    },
    {
      "category": "WEAKNESS",
      "statement": "The `move_to_folder` method in `email_handler.py` hardcodes label IDs like 'INBOX', 'SPAM', 'TRASH'. If Gmail changes these or introduces new system labels, this method might break.",
      "file_name": "src/email/email_handler.py",
      "line_start": 168,
      "line_end": 177,
      "suggestion": "It would be more robust to fetch these system label IDs dynamically using `self.service.users().labels().list(userId='me').execute()` and then map them, rather than hardcoding them. This makes the code resilient to potential changes in Gmail's API or label management.",
      "code_snippet": "        try:\n            # Map folder names to Gmail label IDs\n            folder_mapping = {\n                'inbox': 'INBOX',\n                'spam': 'SPAM',\n                'trash': 'TRASH',\n                'archive': None  # Removing INBOX label effectively archives the message\n            }\n            \n            if folder.lower() not in folder_mapping:",
      "line_numbers": "L168-177"
    },
    {
      "category": "WEAKNESS",
      "statement": "The `_evaluate_rule` method in `rule_engine.py` assumes that if `match_type` is not 'all', it must be 'any'. This could lead to unexpected behavior if other `match_type` values are introduced or if the `match_type` field is missing.",
      "file_name": "src/rules/rule_engine.py",
      "line_start": 39,
      "line_end": 46,
      "suggestion": "Add explicit handling for unknown `match_type` values, perhaps by defaulting to 'all' or raising an error. This improves the predictability and robustness of the rule engine.\n```python\n        match_type = rule.get('match_type', 'all').lower()\n        results = [self._check_condition(email, condition) for condition in conditions]\n\n        if match_type == 'all':\n            return all(results)\n        elif match_type == 'any':\n            return any(results)\n        else:\n            print(f\"Unknown match_type: {match_type}. Defaulting to 'all'.\")\n            return all(results)\n        ```",
      "code_snippet": "            return False\n        \n        match_type = rule.get('match_type', 'all').lower()\n        results = [self._check_condition(email, condition) for condition in conditions]\n        \n        return all(results) if match_type == 'all' else any(results)\n    \n    def _check_condition(self, email: Dict, condition: Dict) -> bool:",
      "line_numbers": "L39-46"
    },
    {
      "category": "WEAKNESS",
      "statement": "The `token.pickle` file is used to store authentication tokens. While convenient, pickle files can be vulnerable to deserialization attacks if not handled with extreme care, potentially leading to unauthorized access.",
      "file_name": "src/auth/gmail_auth.py",
      "line_start": 22,
      "line_end": 27,
      "suggestion": "Consider more secure methods for storing sensitive tokens, such as using environment variables for credentials and a secure token store or encrypted storage for refresh tokens. If pickle must be used, ensure the file has strict permissions and is not accessible by unauthorized users.",
      "code_snippet": "            'https://www.googleapis.com/auth/gmail.labels'\n        ]\n        self.credentials_path = 'credentials.json'\n        self.token_path = 'token.pickle'\n    \n    def _load_saved_credentials(self):",
      "line_numbers": "L22-27"
    },
    {
      "category": "WEAKNESS",
      "statement": "The files `auth_manager.py` and `src/auth/gmail_auth.py` contain identical code for the `GmailAuthManager` class. This redundancy increases maintenance overhead and the risk of inconsistencies.",
      "file_name": "auth_manager.py",
      "line_start": 0,
      "line_end": 0,
      "suggestion": "Consolidate the `GmailAuthManager` class into a single file, preferably within the `src/auth/` directory (`src/auth/gmail_auth.py`), and remove the redundant `auth_manager.py` file.",
      "code_snippet": "",
      "line_numbers": "L0-0"
    }
  ]
};

export const generateReview = async (repoUrl: string): Promise<FinalReport> => {
    // Cast strict type
    const data = MOCK_DATA_RAW;
    // Derive hired status
    const isHired = data.verdict.toLowerCase().includes('hire') && !data.verdict.toLowerCase().includes('no');
    
    return Promise.resolve({
      ...data, 
      repoUrl: repoUrl || "https://github.com/binaryash/gmail-rulemaster",
      hired: isHired
    });
};