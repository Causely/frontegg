const axios = require('axios');
const config = require('../config');
const ErrorUtil = require('./../utils/errorUtil');

const HubspotService = {
    getContactUrl(contact) {
        if (!config.hubspot.contactAppUrl) {
            ErrorUtil.logError('Hubspot app url is not set.')
            return '';
        }
        return contact?.properties?.hs_object_id ? `${config.hubspot.contactAppUrl}/${contact?.properties?.hs_object_id}` : '';
    },

    async createContact({ email, firstName, lastName }) {
        if (!config.hubspot.accessToken) {
            ErrorUtil.logError('HubSpot access token is not set. Skipping contact creation.');
            return;
        }

        try {
            const response = await axios.post(config.hubspot.contactApiUrl, {
                properties: {
                    email,
                    firstname: firstName || '',
                    lastname: lastName || '',
                    lead_source: 'Launch PR',
                    lead_source_detail: 'Product Trial Sign Up',

                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.hubspot.accessToken}`
                }
            });

            console.log('HubSpot contact created:', email);
            return response.data;
        } catch (error) {
            ErrorUtil.logError('Error creating HubSpot contact:', error.response?.data || error.message);
            
            if (error.response?.status === 409) {
                ErrorUtil.logError('Contact already exists in HubSpot:', email);
                return null;
            }
            return null;
        }
    }
};

module.exports = HubspotService; 