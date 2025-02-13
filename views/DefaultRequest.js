const defaultRequest = (body, view, requestType, requestTypeText) => {
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
                        text: 'Title'
                    },
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
                {
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
                },
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

module.exports = { defaultRequest }
