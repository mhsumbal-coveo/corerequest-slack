const { App } = require('@slack/bolt');
const { Version3Client } = require('jira.js');
const express = require('express'); // Import Express
require('dotenv').config();

const {defaultRequest} = require('./views/defaultRequest');

const jiraEmail = "hamzasumbal@gmail.com"; // Your Atlassian account email
const jiraApiToken = process.env.JIRA_API_TOKEN; // The API token you generated

// Initializes your app with your bot token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Initialize Jira client
const jira = new Version3Client({
    host: 'https://hamzasumbal.atlassian.net',
    authentication: {
        basic: {
            email: jiraEmail,
            apiToken: jiraApiToken,
        },
    },
});

// Function to get accountId from email
async function getAccountIdByEmail(email) {
  try {
    const users = await jira.userSearch.findUsers({ query: email });
    if (users.length > 0) {
      return users[0].accountId;
    } else {
      throw new Error(`No Jira user found for email: ${email}`);
    }
  } catch (error) {
    throw new Error(`Failed to get accountId for email ${email}: ${error.message}`);
  }
}

// Function to get available Epics from Jira
async function getEpics() {
  try {
    const epicIssues = await jira.issueSearch.searchForIssuesUsingJql({
      jql: 'issuetype = Epic AND project = "KAN"', // Adjust the project key as needed
      fields: ['summary', 'key'], // Only fetch the summary and key fields
    });

    return epicIssues.issues.map(epic => ({
      text: {
        type: 'plain_text',
        text: epic.fields.summary
      },
      value: epic.key
    }));
  } catch (error) {
    console.error(`Failed to fetch Epics: ${error.message}`);
    return [];
  }
}

// Listen for the `/CoreRequest` command
app.command('/corerequest', async ({ command, ack, client, logger }) => {
  // Acknowledge the command request
  await ack();
  try {
    const epicOptions = await getEpics();
    // Call views.open with the built-in client
    await client.views.open({
      
        trigger_id: command.trigger_id,
        view: {
          type: 'modal',
          callback_id: 'select_request_type',
          title: {
            type: 'plain_text',
            text: 'Core Team Request'
          },
          blocks: [
            {
              type: 'input',
              block_id: 'request_type',
              element: {
                type: 'static_select',
                action_id: 'request_type_select',
                options: epicOptions
              },
              label: {
                type: 'plain_text',
                text: 'What type of request is it?'
              }
            }
          ],
          submit: {
            type: 'plain_text',
            text: 'Next'
          }
        }
      });
  } catch (error) {
    console.error(error);
  }
  
});

// Handle view_submission event for the request type selection
app.view('select_request_type', async ({ ack, body, view, client }) => {
  // Acknowledge the view_submission event

  const requestType = view.state.values.request_type.request_type_select.selected_option.value;
  const requestTypeText = view.state.values.request_type.request_type_select.selected_option.text.text;
  await ack();

  // Render the rest of the form based on the selected request type
  try {
    await client.views.open(defaultRequest(body,view,requestType, requestTypeText));
  } catch (error) {
    console.error(error);
  }
});

// Handle view_submission event for the modal
app.view('create_jira_ticket', async ({ ack, body, view, client }) => {
  // Acknowledge the view_submission event
  await ack();

  // Retrieve the values and handle missing fields by setting default values or handling undefined values
  const summary = view.state.values.summary?.summary_input?.value || 'No summary provided';
  const description = view.state.values.description?.description_input?.value || 'No description provided';
  const priority = view.state.values.priority?.priority_input?.selected_option?.value || 'Medium';
  const assigneeEmail = view.state.values.assignee?.assignee_input?.value;
  const label = view.state.values.label?.label_input?.selected_option?.value || 'Task';
  const dueDate = view.state.values.due_date?.due_date_input?.selected_date; // Optional due date
  const epicKey = view.private_metadata; // Retrieve the stored Epic key

  try {
    let assigneeAccountId = null;

    // Get the accountId for the assignee if the email is provided
    if (assigneeEmail) {
      assigneeAccountId = await getAccountIdByEmail(assigneeEmail);
    }

    const issueFields = {
      project: {
        key: 'KAN'
      },
      summary: summary,
      description: description,
      issuetype: {
        name: 'Task'
      },
      priority: {
        name: priority.charAt(0).toUpperCase() + priority.slice(1)
      },
      labels: [label], // Include the selected label
      parent: {
        key: epicKey
      }
    };

    // Add assignee if provided
    if (assigneeAccountId) {
      issueFields.assignee = {
        id: assigneeAccountId
      };
    }

    // Add due date if provided
    if (dueDate) {
      issueFields.duedate = dueDate;
    }

    const issue = await jira.issues.createIssue({ fields: issueFields });

    // Notify the user that the ticket was created successfully
    await client.chat.postMessage({
      channel: body.user.id,
      text: `Ticket created successfully: ${issue.key}`
    });
  } catch (error) {
    console.error(error.message);
    // Send the error message to the user on Slack
    await client.chat.postMessage({
      channel: body.user.id,
      text: `There was an error creating the ticket: ${error.message}`
    });
  }
});


// Start your app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
