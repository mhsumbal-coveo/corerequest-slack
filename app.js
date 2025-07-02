const { App, ExpressReceiver } = require('@slack/bolt');
const { Version3Client } = require('jira.js');
const express = require('express'); // Import Express
require('dotenv').config();
var cors = require('cors')
const {defaultRequest} = require('./views/DefaultRequest');
const {infoSecRequest} = require('./views/InfoSecRequest');
const { AEPRequest } = require('./views/AEPRequest');
const { CustomDemoRequest, FrontEndRequest, GDEImprovementRequest, AdminConsoleRequest } = require('./views/CustomDemoRequest');
const { similarWebRequest } = require('./views/SimilarWebRequest');
const { marketingEventRequest } = require('./views/MarketingEventRequest');
const { partnerRequest } = require('./views/PartnerRequest');

const jiraEmail = "mhsumbal@coveo.com"; // Your Atlassian account email
const jiraApiToken = process.env.JIRA_API_TOKEN; // The API token you generated
const PORT = process.env.PORT || 3000; // Single port for both Slack & Express


const InfoSecEpicKey = "CTR24-3";
const CustomDemoEpicKey = "CTR24-6";
const AEPRequestEpicKey = "CTR24-7";
const GDEImprovementEpicKey = "CTR24-30";
const SimilarWebEpicKey = "CTR24-10";
const MarketingEventEpicKey = "CTR24-9";
const PartnerRequestEpicKey = "CTR24-8";
const OthersEpicKey = "CTR24-31";

// Initialize ExpressReceiver
const receiver = new ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    receiver 
});

// Initialize Jira client
const jira = new Version3Client({
    host: 'https://coveord.atlassian.net',
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
      jql: 'issuetype = Epic AND project = "CTR24"', // Adjust the project key as needed
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
          callback_id: 'select_request_type_submit',
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
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: 'Click Next for more options'
              },
              accessory: {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Next'
                },
                action_id: 'select_request_type'
              }
            },
            
          ],
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

app.action('select_request_type', async ({ ack, body, client }) => {

  await ack();
  const view = body.view;

  const requestType = view.state.values.request_type.request_type_select.selected_option.value;
  const requestTypeText = view.state.values.request_type.request_type_select.selected_option.text.text;
  console.log("Request Type: ", requestType);

  try {
    let updatedView;
    
    switch (requestType) {
      case InfoSecEpicKey: // InfoSec Request
        updatedView = infoSecRequest(body, view, requestType, requestTypeText);
        break;
      case CustomDemoEpicKey: // Custom Demo Request
        updatedView = CustomDemoRequest(body, view, requestType, requestTypeText);
        break;
      case AEPRequestEpicKey: // AEP Request
        updatedView = AEPRequest(body, view, requestType, requestTypeText);
        break;
      case GDEImprovementEpicKey: // GDE Improvement / Feedback Request
        updatedView = GDEImprovementRequest(body, view, requestType, requestTypeText);
        break;
      case SimilarWebEpicKey:
        updatedView = similarWebRequest(body, view, requestType, requestTypeText);
        break;

      case MarketingEventEpicKey:
        updatedView = marketingEventRequest(body, view, requestType, requestTypeText);
        break;

      case PartnerRequestEpicKey:
        updatedView = partnerRequest(body, view, requestType, requestTypeText);
        break;  

      default:
        updatedView = defaultRequest(body, view, requestType, requestTypeText);
        break;
    }

    updatedView = {...updatedView ,hash: view.hash, view_id: view.id}
    // Use client.views.update instead of client.views.open
    await client.views.update(updatedView);

  } catch (error) {
    console.error("Failed to update view:", error);
  }
});

app.view('select_request_type_submit', async ({ ack, body, view, client }) => {

    await ack({
      response_action: 'errors',
      errors: {
        request_type: 'Please press the "Next" button before submitting.',
      }
    });
    return;

});


app.action('custom_demo_request', async ({ ack, body, client }) => {
  const view = body.view;
  const demo_help = view.state.values.demo_help.demo_help_select.selected_option.value;
  await ack();
  let updatedView;
  if(demo_help === 'frontend'){
    
    updatedView = FrontEndRequest(body, view, 'CTR24-6', 'Front End Request');
    /* await client.views.open(FrontEndRequest(body, view, 'CTR24-6', 'Front End Request')); */
  } else if (demo_help === 'adminconsole'){
    updatedView = AdminConsoleRequest(body, view, 'CTR24-6', 'Admin Console Request');
    /* await client.views.open(defaultRequest(body, view, 'CTR24-6', 'Admin Console Request')); */
  }
  updatedView = {...updatedView ,hash: view.hash, view_id: view.id}
  await client.views.update(updatedView);
  
});

// Handle view_submission event for the modal
app.view('create_jira_ticket', async ({ ack, body, view, client }) => {
  // Acknowledge the view_submission event
  await ack();

  const UserInfo = await client.users.info({user: body.user.id});
  const ReporterId = await getAccountIdByEmail(UserInfo.user.name + '@coveo.com');
  console.log("username of user is: ", UserInfo.user.name);

  // Retrieve the values and handle missing fields by setting default values or handling undefined values
  const summary = view.state.values.summary?.summary_input?.value || 'No summary provided';
  const orgid = view.state.values.orgid?.orgid_input?.value || '';
  let description = view.state.values.description?.description_input?.value || 'No description provided';
  const priority = view.state.values.priority?.priority_input?.selected_option?.value || 'Medium';
  const assigneeEmail = view.state.values.assignee?.assignee_input?.value;
  let label = view.state.values.label?.label_input?.selected_option?.value || 'Task';
  const epicKey = view.private_metadata; // Retrieve the stored Epic key
  const dueDate = view.state.values.due_date?.due_date_input?.selected_date || null; // Optional due date
  const opp_link_sf = view.state.values.opp_link_sf?.opp_link_sf_input?.value || null;
  const infosec_team_assistance = view.state.values.infosec_team_assistance?.infosec_team_assistance_input?.value || null;
  const demo_environment = view.state.values.demo_environment?.demo_environment_select?.selected_option || null;
  const customer_website = view.state.values.customer_website?.customer_website_url?.value || "Not provided";
  const aep_checklist = view.state.values.aep_checklist?.aep_checklist_url?.value || null;
  const beacon_delivery = view.state.values.beacon_delivery?.beacon_delivery_date?.selected_date || "Not provided";
  const demo_delivery = view.state.values.demo_delivery?.demo_delivery_date?.selected_date || "Not provided";
  const catalog_shared = view.state.values.catalog_shared?.catalog_shared_radio?.selected_option?.value || "No answer";

  let AssigneeSlackUserID = "";
  try {
    let assigneeAccountId = null;
    if (assigneeEmail) {
      assigneeAccountId = await getAccountIdByEmail(assigneeEmail);
    }

    // Get the accountId for the assignee if the email is provided
    // Assign all InfoSec requests to Ravi
    
    
    let issueFields = {
      project: {
        key: 'CTR24'
      },
      reporter: {
        id: ReporterId
      },
      summary: summary,
      description: description,
      issuetype: {
        name: 'Task'
      },
      priority: {
        name: priority.charAt(0).toUpperCase() + priority.slice(1)
      },
      labels: [label],
      parent: {
        key: epicKey
      },
      duedate: dueDate,
    };
    
    if(epicKey === InfoSecEpicKey){ // InfoSec Request
      // Auto assign to Ravi if it's an InfoSec request
      assigneeAccountId = await getAccountIdByEmail('rravoory@coveo.com'); //rravoory@coveo.com
      issueFields.labels = ['Question']; // Always a question
      issueFields.customfield_17260 = opp_link_sf;
      issueFields.assignee = {id : assigneeAccountId};
      AssigneeSlackUserID = 'UD16A768Z'; //ravi
    }

    else if(epicKey === CustomDemoEpicKey){  // Custom Demo Request
      if(view.title.text === 'Front-End Demo Request'){
        issueFields.description = "Front End Demo Request\n" + 
        'Customer Website: ' + customer_website +
        '\n\n' + issueFields.description + "\n\n" + 'Organization ID: ' + orgid + '\n\n';
        issueFields.customfield_17259 = [{value: demo_environment.text.text}];
      } else {
        issueFields.description = "Admin Console Request\n\n" + issueFields.description;
        issueFields.description = issueFields.description + 'Organization ID: ' + orgid + '\n\n';
      }
      AssigneeSlackUserID = 'U03DT9P4Z5J'; //mhsumbal@coveo.com
    }

    else if(epicKey === AEPRequestEpicKey){  // AEP Request
      assigneeAccountId = await getAccountIdByEmail('mhsumbal@coveo.com'); //mhsumbal@coveo.com
      issueFields.description = 'Beacon Script Delivery Date: ' + beacon_delivery + '\n' + 'Demo Delivery Date: ' + demo_delivery + '\n' +
      'Customer Website: ' + customer_website + '\n' + 'Catalog Shared: ' + catalog_shared + '\n\n' +
      + description;
      issueFields.customfield_17262 = aep_checklist;
      AssigneeSlackUserID = 'U03DT9P4Z5J'; //mhsumbal@coveo.com
      issueFields.assignee = {id : assigneeAccountId};

    }

    else if(epicKey === GDEImprovementEpicKey){  // GDE Improvement / Feedback Request
      issueFields.customfield_17259 = [{value: demo_environment.text.text}];
      AssigneeSlackUserID = 'U03DT9P4Z5J'; //mhsumbal@coveo.com

    }
    
    
    else if (epicKey === SimilarWebEpicKey){  // Similar Web Request
      issueFields.description = "QPM/Similar Web Request\n" +
      'Customer Website: ' + customer_website +
      '\n\n' + issueFields.description;
      assigneeAccountId = await getAccountIdByEmail('kklepp@coveo.com');
      issueFields.assignee = {id : assigneeAccountId};
      AssigneeSlackUserID = 'URBL5ELR4' //kklepp
    }
    
    else if (epicKey === MarketingEventEpicKey){  // Marketing Event Request
      issueFields.description = "Marketing Event Request\n" +
      'Event Date ' + dueDate +
      '\n\n' + issueFields.description;
      assigneeAccountId = await getAccountIdByEmail('rreffner@coveo.com'); 
      issueFields.assignee = {id : assigneeAccountId};
      AssigneeSlackUserID = 'U08719EP9T3' //Rich
    }


    else if (epicKey === PartnerRequestEpicKey){  // Partner Request
      assigneeAccountId = await getAccountIdByEmail('kklepp@coveo.com'); 
      issueFields.assignee = {id : assigneeAccountId};
      AssigneeSlackUserID = 'URBL5ELR4' //kklepp
    }
    else if (epicKey === OthersEpicKey){  // Others
      assigneeAccountId = await getAccountIdByEmail('kklepp@coveo.com'); 
      issueFields.assignee = {id : assigneeAccountId};
      AssigneeSlackUserID = 'URBL5ELR4' //kklepp
    }

    const issue = await jira.issues.createIssue({ fields: issueFields });

    // Notify the user that the ticket was created successfully

    const coreRequestChannel = "C07TDAD6GBB";

    let epicName = "Others";

    if(epicKey === InfoSecEpicKey){
      epicName = "InfoSec Request";
    } else if(epicKey === CustomDemoEpicKey){
      epicName = "Custom Demo Request";
    } else if(epicKey === AEPRequestEpicKey){
      epicName = "AEP Request";
    } else if(epicKey === GDEImprovementEpicKey){
      epicName = "GDE Improvement / Feedback Request";
    } else if(epicKey === SimilarWebEpicKey){
      epicName = "Similar Web Request";
    } else if(epicKey === MarketingEventEpicKey){
      epicName = "Marketing Event Request";
    } else if(epicKey === PartnerRequestEpicKey){
      epicName = "Partner Request";
    }



    if(AssigneeSlackUserID){
      await client.chat.postMessage({
        channel: AssigneeSlackUserID,
        text: `Hey, A ticket was assigned to you <https://coveord.atlassian.net/jira/software/c/projects/CTR24/list?selectedIssue=${issue.key}|${issue.key}> by <@${UserInfo.user.name}>\n
      Epic: ${epicName}\n
      Summary: ${summary}\n
      Description: ${description}\n
      ${priority ? `Priority: ${priority}\n` : ""}
      ${dueDate ? `Due Date: ${dueDate}\n` : ""}`
      });
    }

    await client.chat.postMessage({
      channel: coreRequestChannel,
      text: `Ticket created successfully <https://coveord.atlassian.net/jira/software/c/projects/CTR24/list?selectedIssue=${issue.key}|${issue.key}> by <@${UserInfo.user.name}>\n 
    Epic: ${epicName}\n 
    Summary: ${summary}\n
    Description: ${description}\n
    ${priority ? `Priority: ${priority}\n` : ""}
    ${dueDate ? `Due Date: ${dueDate}\n` : ""}`
    });


    await client.chat.postMessage({
      channel: body.user.id,
      text: `Ticket created successfully <https://coveord.atlassian.net/jira/software/c/projects/CTR24/list?selectedIssue=${issue.key}|${issue.key}>`
    });


  } catch (error) {
    console.error(error);
    // Send the error message to the user on Slack
    await client.chat.postMessage({
      channel: body.user.id,
      text: `There was an error creating the ticket: ${error.message}`
    });
  }
});


//----------------- Similar Web Routes -----------------

const expressApp = receiver.app;
const similarWebRoutes = require('./websight/similarWebRoutes'); 
expressApp.use(similarWebRoutes); 

//-----------------------------------------------------------------

const server = expressApp.listen(PORT, async () => {
  console.log(`🚀 Core Request APP is running on port ${PORT}`);
});