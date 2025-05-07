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

            // WHEN
            const result = await HubspotService.createContact(mockContact);

            // THEN
            expect(result).toEqual(mockResponse.data);
            expect(axios.post).toHaveBeenCalledWith(
                config.hubspot.apiUrl,
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
        });

        it('should return null if contact already exists', async () => {
            // GIVEN
            const error = {
                response: {
                    status: 409,
                    data: { message: 'Contact already exists' }
                }
            };
            vi.spyOn(axios, 'post').mockRejectedValueOnce(error);

            // WHEN
            const result = await HubspotService.createContact(mockContact);

            // THEN
            expect(result).toBeNull();
        });

        it('should throw error on other failures', async () => {
            // GIVEN
            const error = new Error('API Error');
            vi.spyOn(axios, 'post').mockRejectedValueOnce(error);
            vi.spyOn(ErrorUtil, 'internal');

            // WHEN/THEN
            await expect(HubspotService.createContact(mockContact)).rejects.toThrow('Internal Server Error: Failed to create HubSpot contact');
            expect(ErrorUtil.internal).toHaveBeenCalledWith('Failed to create HubSpot contact');
        });

        it('should skip contact creation if access token is not set', async () => {
            // GIVEN
            const originalToken = config.hubspot.accessToken;
            config.hubspot.accessToken = null;

            // WHEN
            const result = await HubspotService.createContact(mockContact);

            // THEN
            expect(result).toBeUndefined();
            expect(axios.post).not.toHaveBeenCalled();

            // Cleanup
            config.hubspot.accessToken = originalToken;
        });
    });
}); 