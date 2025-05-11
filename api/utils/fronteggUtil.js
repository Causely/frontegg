const axios = require('axios');
const config = require('../config');
const ErrorUtil = require('./errorUtil');

/**
 * Utility class for interacting with Frontegg API
 * @class FronteggUtil
 */
class FronteggUtil {
    /**
     * Retrieves an authentication token from Frontegg
     * @async
     * @returns {Promise<string>} The access token
     * @throws {ErrorUtil} If authentication fails
     */
    async getAuthToken() {
        try {
            const response = await axios.post(config.frontegg.authUrl, {
                email: config.frontegg.clientEmail,
                password: config.frontegg.clientPassword
            }, {
                headers: { 'Content-Type': 'application/json' },
            });
            return response.data.accessToken;
        } catch (error) {
            console.error('Error fetching auth token:', error.response?.data || error.message);
            throw ErrorUtil.internal('Failed to authenticate with Frontegg');
        }
    }

    /**
     * Retrieves details for a specific tenant
     * @async
     * @param {string} tenantId - The ID of the tenant to fetch details for
     * @returns {Promise<Object>} The tenant details
     * @throws {ErrorUtil} If tenant details cannot be fetched
     */
    async getTenantDetails(tenantId) {
        try {
            const token = await this.getAuthToken();
            const response = await axios.get(`${config.frontegg.tenantApiUrl}/${tenantId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching tenant details:', error.response?.data || error.message);
            throw ErrorUtil.internal('Failed to fetch tenant details');
        }
    }

    /**
     * Assigns a user to a tenant with the demo role
     * @async
     * @param {string} userEmail - The email of the user to assign
     * @returns {Promise<Object>} The assignment response data
     * @throws {ErrorUtil} If user assignment fails
     */
    async assignUserToTenant(userEmail) {
        try {
            const token = await this.getAuthToken();
            const response = await axios.post(config.frontegg.userTenantUrl, {
                email: userEmail,
                roleIds: [config.frontegg.demoRoleId],
                skipInviteEmail: true,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('User successfully assigned to tenant:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error assigning user to tenant:', error.response?.data || error.message);
            throw ErrorUtil.internal('Failed to assign user to tenant');
        }
    }
}

module.exports = new FronteggUtil(); 