const AEPRequest = (body, view, requestType, requestTypeText) => {
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
            "blocks": [
                {
                    "type": "header",
                    "text": {
                        "type": "plain_text",
                        "text": `${requestTypeText}`,
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    block_id: 'aep_checklist',
                    "element": {
                        "type": "url_text_input",
                        "action_id": "aep_checklist_url"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "AEP Checklist",
                        "emoji": true
                    },
                    "optional": true
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Make a copy of the checklist here: <https://docs.google.com/spreadsheets/d/107jN-A763acde2fx8rUF_p8qS2M_dcune97cv_D4cqc/edit?gid=0#gid=0>"
                    }
                },
                {
                    "type": "input",
                    "block_id": "beacon_delivery",
                    "element": {
                        "type": "datepicker",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select a date",
                            "emoji": true
                        },
                        "action_id": "beacon_delivery_date"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Expected Beacon Script Delivery Date",
                        "emoji": true
                    },
                    "optional": true
                },
                {
                    "type": "input",
                    "block_id": "demo_delivery",
                    "element": {
                        "type": "datepicker",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select a date",
                            "emoji": true
                        },
                        "action_id": "demo_delivery_date"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Expected Custom Demo Delivery Date",
                        "emoji": true
                    },
                    "optional": true
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
                    "block_id": "catalog_shared",
                    "element": {
                        "type": "radio_buttons",
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Yes",
                                    "emoji": true
                                },
                                "value": "Yes"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "No",
                                    "emoji": true
                                },
                                "value": "No"
                            }
                        ],
                        "action_id": "catalog_shared_radio"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Have shared Catalog?",
                        "emoji": true
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
                        "text": "Customer Name",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "block_id": "description",
                    "element": {
                        "type": "plain_text_input",
                        "multiline": true,
                        "action_id": "description_input"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Description",
                        "emoji": true
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

module.exports = { AEPRequest }
