import { describe, it, expect, afterEach, vi } from 'vitest';
const axios = require('axios');
const HubspotService = require('../../services/hubspotService');
const config = require('../../config');
const ErrorUtil = require('../../utils/errorUtil');

describe('HubspotService', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('createContact', () => {
        const mockContact = {
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe'
        };

        it('should create contact successfully', async () => {
            // GIVEN
            const mockResponse = {
                data: {
                    id: '123',
                    properties: {
                        email: mockContact.email,
                        firstname: mockContact.firstName,
                        lastname: mockContact.lastName
                    }
                }
            };

            vi.spyOn(axios, 'post').mockResolvedValueOnce(mockResponse);
            vi.spyOn(ErrorUtil, 'logError');

            // WHEN
            const result = await HubspotService.createContact(mockContact);

            // THEN
            expect(result).toEqual(mockResponse.data);
            expect(axios.post).toHaveBeenCalledWith(
                config.hubspot.contactApiUrl,
                {
                    properties: {
                        email: mockContact.email,
                        firstname: mockContact.firstName,
                        lastname: mockContact.lastName
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${config.hubspot.accessToken}`
                    }
                }
            );
            expect(ErrorUtil.logError).not.toHaveBeenCalled();
        });

        it('should log error and return null if contact already exists', async () => {
            // GIVEN
            const error = {
                response: {
                    status: 409,
                    data: { message: 'Contact already exists' }
                }
            };
            vi.spyOn(axios, 'post').mockRejectedValueOnce(error);
            vi.spyOn(ErrorUtil, 'logError');

            // WHEN
            const result = await HubspotService.createContact(mockContact);

            // THEN
            expect(result).toBeNull();
            expect(ErrorUtil.logError).toHaveBeenCalledWith('Error creating HubSpot contact:', error.response?.data || error.message);
            expect(ErrorUtil.logError).toHaveBeenCalledWith('Contact already exists in HubSpot:', mockContact.email);
        });

        it('should log error and return null on other failures', async () => {
            // GIVEN
            const error = new Error('API Error');
            vi.spyOn(axios, 'post').mockRejectedValueOnce(error);
            vi.spyOn(ErrorUtil, 'logError');

            // WHEN
            const result = await HubspotService.createContact(mockContact);

            // THEN
            expect(result).toBeNull();
            expect(ErrorUtil.logError).toHaveBeenCalledWith('Error creating HubSpot contact:', error.response?.data || error.message);
        });

        it('should skip contact creation if access token is not set', async () => {
            // GIVEN
            const originalToken = config.hubspot.accessToken;
            config.hubspot.accessToken = null;
            vi.spyOn(ErrorUtil, 'logError');

            // WHEN
            const result = await HubspotService.createContact(mockContact);

            // THEN
            expect(result).toBeUndefined();
            expect(axios.post).not.toHaveBeenCalled();
            expect(ErrorUtil.logError).toHaveBeenCalledWith('HubSpot access token is not set. Skipping contact creation.');

            // Cleanup
            config.hubspot.accessToken = originalToken;
        });
    });
}); 