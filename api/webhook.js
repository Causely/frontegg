const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('./config');
const ErrorUtil = require('./utils/errorUtil');
const FronteggUtil = require('./utils/fronteggUtil');
const UserUtil = require('./utils/userUtil');
const HubspotService = require('./services/hubspotService');
const SlackService = require('./services/slackService');

const app = express();
app.use(bodyParser.json());

// Middleware to authenticate webhook requests
function authenticateWebhook(req, res, next) {
    const webhookToken = req.headers['x-webhook-secret'];

    if (!webhookToken) {
        throw ErrorUtil.unauthorized('Missing webhook token');
    }

    try {
        jwt.verify(webhookToken, config.webhook.secret);
        next();
    } catch (err) {
        console.log(err)
        throw ErrorUtil.unauthorized('Invalid webhook token');
    }
}

// Webhook handler
module.exports = async (req, res) => {
    try {
        // Authenticate webhook
        authenticateWebhook(req, res, async () => {
            if (req.method !== 'POST') {
                throw ErrorUtil.methodNotAllowed();
            }

            const { eventKey, eventContext, user } = req.body;

            // user activated event
            if (eventKey === config.events.USER_ACTIVATED && 
                eventContext?.tenantId !== config.frontegg.demoTenantId) {
                await FronteggUtil.assignUserToTenant(
                    user.email,
                );
                return res.status(200).send({
                    status: 'success',
                    message: 'User successfully assigned to tenant.'
                });
            }

            // user signup event
            if (eventKey === config.events.USER_SIGNED_UP) {
                const { firstName, lastName } = UserUtil.parseName(user?.name);
                
                // Create HubSpot contact
                const hubspotContact = await HubspotService.createContact({
                    email: user.email,
                    firstName,
                    lastName
                });

                // Send Slack notification with HubSpot contact URL
                await SlackService.sendMessage(user, HubspotService.getContactUrl(hubspotContact));

                return res.status(200).json({
                    status: 'success',
                    message: 'Successfully processed user signup.'
                });
            }

            throw ErrorUtil.badRequest('Invalid event key or already in the demo tenant');
        });
    } catch (error) {
        ErrorUtil.handle(error, res);
    }
}; 