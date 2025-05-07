const axios = require('axios');
const config = require('../config');
const ErrorUtil = require('../utils/errorUtil');

const HubspotService = {
    async createContact({ email, firstName, lastName }) {
        if (!config.hubspot.accessToken) {
            console.log('HubSpot access token is not set. Skipping contact creation.');
            return;
        }

        try {
            const response = await axios.post(config.hubspot.apiUrl, {
                properties: {
                    email,
                    firstname: firstName || '',
                    lastname: lastName || '',
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
            console.error('Error creating HubSpot contact:', error.response?.data || error.message);
            
            if (error.response?.status === 409) {
                console.log('Contact already exists in HubSpot:', email);
                return null;
            }

            throw ErrorUtil.internal('Failed to create HubSpot contact');
        }
    }
};

module.exports = HubspotService; 