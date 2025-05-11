import { describe, it, expect, afterEach, vi } from 'vitest';
const axios = require('axios');
const FronteggUtil = require('../../utils/fronteggUtil');
const config = require('../../config');
const ErrorUtil = require('../../utils/errorUtil');

describe('FronteggUtil', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('getAuthToken', () => {
        it('should return access token on successful authentication', async () => {
            // GIVEN
            const mockToken = 'mock-access-token';
            vi.spyOn(axios, 'post').mockResolvedValueOnce({ data: { accessToken: mockToken } });

            // WHEN
            const token = await FronteggUtil.getAuthToken();

            // THEN
            expect(token).toBe(mockToken);
            expect(axios.post).toHaveBeenCalledWith(
                config.frontegg.authUrl,
                {
                    email: config.frontegg.clientEmail,
                    password: config.frontegg.clientPassword
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        });

        it('should throw error on authentication failure', async () => {
            // GIVEN
            const error = new Error('Authentication failed');
            vi.spyOn(axios, 'post').mockRejectedValueOnce(error);
            vi.spyOn(ErrorUtil, 'internal');

            // WHEN/THEN
            await expect(FronteggUtil.getAuthToken())
                .rejects.toThrow('Internal Server Error: Failed to authenticate with Frontegg');
            expect(ErrorUtil.internal).toHaveBeenCalledWith('Failed to authenticate with Frontegg');
        });
    });

    describe('getTenantDetails', () => {
        it('should return tenant details on successful request', async () => {
            // GIVEN
            const mockToken = 'mock-access-token';
            const mockTenantId = 'test-tenant-id';
            const mockTenantData = { name: 'Test Tenant' };

            vi.spyOn(axios, 'post').mockResolvedValueOnce({ data: { accessToken: mockToken } });
            vi.spyOn(axios, 'get').mockResolvedValueOnce({ data: mockTenantData });

            // WHEN
            const tenantDetails = await FronteggUtil.getTenantDetails(mockTenantId);

            // THEN
            expect(tenantDetails).toEqual(mockTenantData);
            expect(axios.get).toHaveBeenCalledWith(
                `${config.frontegg.tenantApiUrl}/${mockTenantId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${mockToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
        });

        it('should throw error on tenant details fetch failure', async () => {
            // GIVEN
            const mockToken = 'mock-access-token';
            const mockTenantId = 'test-tenant-id';
            const error = new Error('Failed to fetch tenant');

            vi.spyOn(axios, 'post').mockResolvedValueOnce({ data: { accessToken: mockToken } });
            vi.spyOn(axios, 'get').mockRejectedValueOnce(error);
            vi.spyOn(ErrorUtil, 'internal');

            // WHEN/THEN
            await expect(FronteggUtil.getTenantDetails(mockTenantId))
                .rejects.toThrow('Internal Server Error: Failed to fetch tenant details');
            expect(ErrorUtil.internal).toHaveBeenCalledWith('Failed to fetch tenant details');
        });
    });

    describe('assignUserToTenant', () => {
        it('should successfully assign user to tenant', async () => {
            // GIVEN
            const mockToken = 'mock-access-token';
            const mockUserEmail = 'test@example.com';
            const mockResponse = { success: true };

            const postSpy = vi.spyOn(axios, 'post');
            postSpy.mockResolvedValueOnce({ data: { accessToken: mockToken } });
            postSpy.mockResolvedValueOnce({ data: mockResponse });

            // WHEN
            const result = await FronteggUtil.assignUserToTenant(mockUserEmail);

            // THEN
            expect(result).toEqual(mockResponse);
            expect(postSpy).toHaveBeenCalledTimes(2);
            expect(postSpy).toHaveBeenNthCalledWith(1,
                config.frontegg.authUrl,
                {
                    email: config.frontegg.clientEmail,
                    password: config.frontegg.clientPassword
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            expect(postSpy).toHaveBeenNthCalledWith(2,
                config.frontegg.userTenantUrl,
                {
                    email: mockUserEmail,
                    roleIds: [config.frontegg.demoRoleId],
                    skipInviteEmail: true
                },
                {
                    headers: {
                        Authorization: `Bearer ${mockToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
        });

        it('should throw error on tenant assignment failure', async () => {
            // GIVEN
            const mockToken = 'mock-access-token';
            const mockUserEmail = 'test@example.com';
            const error = new Error('Assignment failed');

            vi.spyOn(axios, 'post').mockResolvedValueOnce({ data: { accessToken: mockToken } });
            vi.spyOn(axios, 'post').mockRejectedValueOnce(error);
            vi.spyOn(ErrorUtil, 'internal');

            // WHEN/THEN
            await expect(FronteggUtil.assignUserToTenant(mockUserEmail))
                .rejects.toThrow('Internal Server Error: Failed to assign user to tenant');
            expect(ErrorUtil.internal).toHaveBeenCalledWith('Failed to assign user to tenant');
        });
    });
}); 