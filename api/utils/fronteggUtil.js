const axios = require('axios');
const config = require('../config');
const ErrorUtil = require('./../utils/errorUtil');

/**
 * Utility class for interacting with Frontegg API
 * @class FronteggUtil
 */
class FronteggUtil {
    /**
     * Retrieves an authentication token from Frontegg
     * @async
     * @returns {Promise<string>} The access token
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
            ErrorUtil.logError('Error authenticating with Frontegg:', error.response?.data || error.message);
            return null;
        }
    }

    /**
     * Retrieves vendor token from Frontegg
     * @async
     * @returns {Promise<string>} The access token
     */
    async getVendorToken() {
        try {
            const response = await axios.post(config.frontegg.vendorUrl, {
                clientId: config.frontegg.clientId,
                secret: config.frontegg.clientApiKey
            }, {
                headers: { 'Content-Type': 'application/json' },
            });
            return response.data.token;
        } catch (error) {
            ErrorUtil.logError('Error fetching vendor token:', error.response?.data || error.message);
            return null;
        }
    }

    /**
     * Retrieves details for a specific tenant
     * @async
     * @param {string} tenantId - The ID of the tenant to fetch details for
     * @returns {Promise<Object>} The tenant details
     */
    async getTenantDetails(tenantId) {
        try {
            const token = await this.getVendorToken();
            if (!token) {
                ErrorUtil.logError('Failed to get vendor token for tenant details', {});
                return null;
            }

            const response = await axios.get(`${config.frontegg.tenantApiUrl}/${tenantId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            ErrorUtil.logError('Error fetching tenant details:', error.response?.data || error.message);
            return null;
        }
    }

    /**
     * Assigns a user to a tenant with the demo role
     * @async
     * @param {string} userEmail - The email of the user to assign
     * @returns {Promise<Object>} The assignment response data
     */
    async assignUserToTenant(userEmail) {
        try {
            const token = await this.getAuthToken();
            if (!token) {
                ErrorUtil.logError('Failed to get auth token for user assignment', {});
                return null;
            }

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
            ErrorUtil.logError('Error assigning user to tenant:', error.response?.data || error.message);
            return null;
        }
    }
}

module.exports = new FronteggUtil(); 