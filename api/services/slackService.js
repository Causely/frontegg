const axios = require('axios');
const config = require('../config');
const FronteggUtil = require('../utils/fronteggUtil');
const ErrorUtil = require('../utils/errorUtil');

const SlackService = {
    formatMessage({ user, companyName = 'No Company Name', hubspotContactUrl = 'Not created' }) {
        return {
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: 'New User Signup'
                    }
                },
                {
                    type: 'section',
                    fields: [
                        {
                            type: 'mrkdwn',
                            text: `*Name:*\n${user.name || user.email}`
                        },
                        {
                            type: 'mrkdwn',
                            text: `*Email:*\n${user.email}`
                        }
                    ]
                },
                {
                    type: 'section',
                    fields: [
                        {
                            type: 'mrkdwn',
                            text: `*Company:*\n${companyName}`
                        },
                        {
                            type: 'mrkdwn',
                            text: `*HubSpot Contact:*\n${hubspotContactUrl}`
                        }
                    ]
                }
            ]
        };
    },

    async sendMessage(user, hubspotContactUrl) {
        try {
            let companyName = 'No Company Name';
            
            if (user.tenantId) {
                const tenantDetails = await FronteggUtil.getTenantDetails(user.tenantId);
                companyName = tenantDetails?.name || companyName;
            }

            const message = this.formatMessage({ user, companyName, hubspotContactUrl });

            await axios.post(config.slack.apiUrl, message);

            console.log('Slack Message sent:', message);
        } catch (error) {
            throw ErrorUtil.internal('Failed to post to Slack');
        }
    }
};

module.exports = SlackService; 