const GDETemplatesOptions = [
    {
        "text": {
            "type": "plain_text",
            "text": "GDE-atomic",
            "emoji": true
        },
        "value": "21998"
    },
    {
        "text": {
            "type": "plain_text",
            "text": "GDE-CAPI",
            "emoji": true
        },
        "value": "21999"
    },
    {
        "text": {
            "type": "plain_text",
            "text": "GDE-workplace-atomic",
            "emoji": true
        },
        "value": "22000"
    },
    {
        "text": {
            "type": "plain_text",
            "text": "GDE for AEP",
            "emoji": true
        },
        "value": "22001"
    },
    {
        "text": {
            "type": "plain_text",
            "text": "GDE for salesforce",
            "emoji": true
        },
        "value": "22002"
    },
    {
        "text": {
            "type": "plain_text",
            "text": "GDE simple builder",
            "emoji": true
        },
        "value": "22003"
    },
]

const CustomDemoRequest = (body, view, requestType, requestTypeText) => {
    return {
        trigger_id: body.trigger_id,
        view: {
            type: 'modal',
            callback_id: 'custom_demo_request',
            title: {
                type: 'plain_text',
                text: 'Custom Demo Request'
            },
            blocks: [
                {
                    type: 'input',
                    block_id: 'demo_help',
                    element: {
                        type: 'static_select',
                        action_id: 'demo_help_select',
                        options: [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Front-End",
                                    "emoji": true
                                },
                                "value": "frontend"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Admin Console",
                                    "emoji": true
                                },
                                "value": "adminconsole"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Admin Console & Front-End",
                                    "emoji": true
                                },
                                "value": "adminconsolefrontend"
                            },
                        ],
                    },
                    label: {
                        type: 'plain_text',
                        text: 'Need help in Frontend or Admin Console?'
                    }
                }           , {
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
                      action_id: 'custom_demo_request'
                    }
                  },
            ],
            private_metadata: requestType,
            submit: {
                type: 'plain_text',
                text: 'Submit'
            }
        }
    }
}

const FrontEndRequest = (body, view, requestType, requestTypeText) => {
    return {
        trigger_id: body.trigger_id,
        view: {
            type: 'modal',
            callback_id: 'create_jira_ticket',
            title: {
                type: 'plain_text',
                text: 'Front-End Demo Request'
            },
            "blocks": [
                {
                    "type": "header",
                    "text": {
                        "type": "plain_text",
                        "text": "Front-End Demo Request",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "demo_environment",
                    "element": {
                        "type": "static_select",
                        "action_id": "demo_environment_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select an item",
                            "emoji": true
                        },
                        "options": GDETemplatesOptions,
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Demo Environment",
                        "emoji": true
                    }
                },
                {
                    type: 'input',
                    block_id: 'orgid',
                    element: {
                        type: 'plain_text_input',
                        action_id: 'orgid_input',
                        "placeholder": {
                        "type": "plain_text",
                        "text": "Enter the organization id"
            }
                    },
                    label: {
                        type: 'plain_text',
                        text: 'Organization ID'
                    },
                },
                {
                    "type": "input",
                    "block_id": "customer_website",
                    "element": {
                        "type": "url_text_input",
                        "action_id": "customer_website_url"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Customer Website",
                        "emoji": true
                    },
                    "optional": true
                },
                {
                    "type": "input",
                    "block_id": "due_date",
                    "element": {
                        "type": "datepicker",
                        "action_id": "due_date_input",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select a date"
                        }
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Demo Date"
                    },
                    "optional": true
                },
                {
                    "type": "input",
                    "block_id": "summary",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "summary_input"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Customer Name"
                    }
                },
                {
                    "type": "input",
                    "block_id": "description",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "description_input",
                        "multiline": true
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Description"
                    }
                },
                {
                    "type": "input",
                    "block_id": "priority",
                    "element": {
                        "type": "static_select",
                        "action_id": "priority_input",
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Highest"
                                },
                                "value": "Highest"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "High"
                                },
                                "value": "High"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Medium"
                                },
                                "value": "Medium"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Low"
                                },
                                "value": "Low"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Lowest"
                                },
                                "value": "Lowest"
                            }
                        ]
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Priority"
                    },
                    "optional": true
                },
                {
                    "type": "input",
                    "block_id": "label",
                    "element": {
                        "type": "static_select",
                        "action_id": "label_input",
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Bug"
                                },
                                "value": "Bug"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Question"
                                },
                                "value": "Question"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Feature"
                                },
                                "value": "Feature"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Task"
                                },
                                "value": "Task"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "New Demo"
                                },
                                "value": "New_Demo"
                            }
                        ]
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Label"
                    },
                    "optional": true
                }
            ],
            private_metadata: requestType,
            submit: {
                type: 'plain_text',
                text: 'Submit'
            }
        }
    }
}


const AdminConsoleRequest = (body, view, requestType, requestTypeText) => {
    return {
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
                    type: "section",
                    fields: [
                        {
                            type: "mrkdwn",
                            text: `*${requestTypeText}*`,
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
                        text: 'Customer Name'
                    },
                }, 
                {
                    type: 'input',
                    block_id: 'orgid',
                    element: {
                        type: 'plain_text_input',
                        action_id: 'orgid_input',
                        "placeholder": {
                        "type": "plain_text",
                        "text": "Enter the organization id"
            }
                    },
                    label: {
                        type: 'plain_text',
                        text: 'Organization ID'
                    },
                },
                {
                    type: 'input',
                    block_id: 'description',
                    element: {
                        type: 'plain_text_input',
                        action_id: 'description_input',
                        multiline: true,
                        "placeholder": {
                "type": "plain_text",
                "text": "please provide the type of assistance required CRGA, Analytics, ML models, Content indexing, security, Generic API connector, etc."
            }
                    },
                    label: {
                        type: 'plain_text',
                        text: 'Description'
                    },
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
                    },
                    optional: true
                },
                /* {
                    type: 'input',
                    block_id: 'label',
                    element: {
                        type: 'static_select',
                        action_id: 'label_input',
                        options: [
                            {
                                text: {
                                    type: 'plain_text',
                                    text: 'Bug'
                                },
                                value: 'Bug'
                            },
                            {
                                text: {
                                    type: 'plain_text',
                                    text: 'Question'
                                },
                                value: 'Question'
                            },
                            {
                                text: {
                                    type: 'plain_text',
                                    text: 'Feature'
                                },
                                value: 'Feature'
                            },
                            {
                                text: {
                                    type: 'plain_text',
                                    text: 'Task'
                                },
                                value: 'Task'
                            },
                            {
                                text: {
                                    type: 'plain_text',
                                    text: 'New Demo'
                                },
                                value: 'New_Demo'
                            }
                        ]
                    },
                    label: {
                        type: 'plain_text',
                        text: 'Label'
                    },
                    optional: true
                }, */
/*                 {
                    type: 'input',
                    block_id: 'assignee',
                    element: {
                        type: 'plain_text_input',
                        action_id: 'assignee_input'
                    },
                    label: {
                        type: 'plain_text',
                        text: 'Assignee (Jira Email)'
                    },
                    optional: true
                }, */
                {
                    type: 'input',
                    block_id: 'due_date',
                    element: {
                        type: 'datepicker',
                        action_id: 'due_date_input',
                        placeholder: {
                            type: 'plain_text',
                            text: 'Select a due date'
                        }
                    },
                    label: {
                        type: 'plain_text',
                        text: 'Due Date'
                    },
                    optional: true
                }
            ],
            private_metadata: requestType, // Store the selected Epic key
            submit: {
                type: 'plain_text',
                text: 'Submit'
            }
        }
    }
}

const GDEImprovementRequest = (body, view, requestType, requestTypeText) => {
    return {
        trigger_id: body.trigger_id,
        view: {
            type: 'modal',
            callback_id: 'create_jira_ticket',
            title: {
                type: 'plain_text',
                text: `GDE Improvement/Feedback`
            },
            "blocks": [
                {
                    "type": "header",
                    "text": {
                        "type": "plain_text",
                        "text": "GDE Improvement/Feedback Request",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "demo_environment",
                    "element": {
                        "type": "static_select",
                        "action_id": "demo_environment_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select an item",
                            "emoji": true
                        },
                        "options": GDETemplatesOptions,
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Demo Environment",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "summary",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "summary_input"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Summary"
                    }
                },
                {
                    "type": "input",
                    "block_id": "description",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "description_input",
                        "multiline": true
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Description"
                    }
                },
                {
                    "type": "input",
                    "block_id": "priority",
                    "element": {
                        "type": "static_select",
                        "action_id": "priority_input",
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Highest"
                                },
                                "value": "Highest"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "High"
                                },
                                "value": "High"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Medium"
                                },
                                "value": "Medium"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Low"
                                },
                                "value": "Low"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Lowest"
                                },
                                "value": "Lowest"
                            }
                        ]
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Priority"
                    },
                    "optional": true
                },
/*                 {
                    "type": "input",
                    "block_id": "label",
                    "element": {
                        "type": "static_select",
                        "action_id": "label_input",
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Bug"
                                },
                                "value": "Bug"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Question"
                                },
                                "value": "Question"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Feature"
                                },
                                "value": "Feature"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Task"
                                },
                                "value": "Task"
                            },
                        ]
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Label"
                    },
                    "optional": true
                } */
            ],
            private_metadata: requestType,
            submit: {
                type: 'plain_text',
                text: 'Submit'
            }
        }
    }
}





module.exports = { CustomDemoRequest, FrontEndRequest, GDEImprovementRequest,AdminConsoleRequest };