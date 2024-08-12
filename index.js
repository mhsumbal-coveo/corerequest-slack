const axios = require('axios');
require('dotenv').config();

const jiraEmail = "hamzasumbal@gmail.com"; // Your Atlassian account email
const jiraApiToken = process.env.JIRA_API_TOKEN; // The API token you generated

async function createJiraIssue() {
  try {
    const response = await axios.post(
      'https://hamzasumbal.atlassian.net/rest/api/2/issue',
      {
        fields: {
          project: {
            key: 'KAN'
          },
          summary: 'Issue Summary',
          description: 'Issue Description',
          issuetype: {
            name: 'Task'
          },
          priority: {
            name: 'High'
          },
          assignee: {
            name: 'hamza sumbal'
          }
        }
      },
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Jira response:', response.data);
  } catch (error) {
    console.error('Error creating Jira issue:', error.response ? error.response.data : error.message);
  }
}

createJiraIssue();
