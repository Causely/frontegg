const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Function to get authentication token
async function getAuthToken() {
    try {
        const response = await axios.post(process.env.FRONTEGG_AUTH_URL, {
            email:  process.env.CLIENT_EMAIL,
            password: process.env.CLIENT_PASSWORD,
        }, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data.accessToken;
    } catch (error) {
        console.error('Error fetching auth token:', error.response.data);
        throw new Error('Failed to authenticate with Frontegg.');
    }
}

// Function to call the user tenant API
async function assignUserToTenant(userEmail) {
    try {
        const token = await getAuthToken();
        const url = `${process.env.FRONTEGG_USER_TENANT_URL}`;

        const response = await axios.post(url, {
            email: userEmail,
            roleIds: [process.env.DEMO_ROLE_ID],
            skipInviteEmail: true,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('User successfully assigned to tenant:', response.data);
    } catch (error) {
        console.error('Error assigning user to tenant:', error.response?.data || error.message);
        throw new Error('Failed to assign user to tenant.');
    }
}

// Webhook handler
module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send({ message: 'Method not allowed' });
    }

    const { eventKey, eventContext, user } = req.body;

    if (eventKey === 'frontegg.user.activated' && eventContext?.tenantId !== process.env.DEMO_TENANT_ID)  {
        try {
            await assignUserToTenant(user.email);

            res.status(200).send({ message: 'User successfully assigned to tenant.' });
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    } else {
        res.status(400).send({ message: 'Invalid event key or already in the demo tenant.' });
    }
};
