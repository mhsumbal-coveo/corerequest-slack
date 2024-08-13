const { App } = require('@slack/bolt');
const { Version3Client } = require('jira.js');
require('dotenv').config();

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

/*   console.log(requestTypeText); */

  // Render the rest of the form based on the selected request type
  try {
    await client.views.open({
      trigger_id: body.trigger_id,
      view_id: view.id,
      view: {
        type: 'modal',
        callback_id: 'create_jira_ticket',
        title: {
          type: 'plain_text',
          text: 'Core Team Request'
        },
        blocks: [
          {
            "type": "section",
            "fields": [
              {
                "type": "mrkdwn",
                "text": `*${requestTypeText}*`,
              }
            ]
          },
          {
            type: 'input',
            block_id: 'summary',
            element: {
              type: 'plain_text_input',
              action_id: 'summary_input'
            },
            label: {
              type: 'plain_text',
              text: `Summary`
            }
          },
          {
            type: 'input',
            block_id: 'description',
            element: {
              type: 'plain_text_input',
              action_id: 'description_input',
              multiline: true
            },
            label: {
              type: 'plain_text',
              text: 'Description'
            }
          },
          {
            type: 'input',
            block_id: 'priority',
            element: {
              type: 'static_select',
              action_id: 'priority_input',
              options: [
                {
                  text: {
                    type: 'plain_text',
                    text: 'Highest'
                  },
                  value: 'Highest'
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'High'
                  },
                  value: 'High'
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Medium'
                  },
                  value: 'Medium'
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Low'
                  },
                  value: 'Low'
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Lowest'
                  },
                  value: 'Lowest'
                }
              ]
            },
            label: {
              type: 'plain_text',
              text: 'Priority'
            }
          },
          {
            type: 'input',
            block_id: 'assignee',
            element: {
              type: 'plain_text_input',
              action_id: 'assignee_input'
            },
            label: {
              type: 'plain_text',
              text: 'Assignee (Jira Email)'
            }
          }
        ],
        private_metadata: requestType, // Store the selected Epic key
        submit: {
          type: 'plain_text',
          text: 'Submit'
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
});



// Handle view_submission event for the modal
app.view('create_jira_ticket', async ({ ack, body, view, client }) => {
  // Acknowledge the view_submission event
  await ack();

  const summary = view.state.values.summary.summary_input.value;
  const description = view.state.values.description.description_input.value;
  const priority = view.state.values.priority.priority_input.selected_option.value;
  const assigneeEmail = view.state.values.assignee.assignee_input.value;
  const epicKey = view.private_metadata; // Retrieve the stored Epic key
  try {
    // Get the accountId for the assignee
    const assigneeAccountId = await getAccountIdByEmail(assigneeEmail);

    const issue = await jira.issues.createIssue({
      fields: {
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
        assignee: {
          id: assigneeAccountId // Use accountId to assign the ticket
        },
        parent: {
          key: epicKey
        } 
      }
    });

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
