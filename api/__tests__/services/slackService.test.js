import { describe, it, expect, afterEach, vi } from 'vitest';
const axios = require('axios');
const SlackService = require('../../services/slackService');
const FronteggUtil = require('../../utils/fronteggUtil');
const config = require('../../config');
const ErrorUtil = require('../../utils/errorUtil');

describe('SlackService', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('formatMessage', () => {
        it('should format message with all data', () => {
            // GIVEN
            const user = {
                name: 'John Doe',
                email: 'test@example.com'
            };
            const companyName = 'Test Company';
            const hubspotContactUrl = 'https://hubspot.com/contact/123';

            // WHEN
            const message = SlackService.formatMessage({ user, companyName, hubspotContactUrl });

            // THEN
            expect(message).toHaveProperty('blocks');
            expect(message.blocks).toHaveLength(3);
            expect(message.blocks[0].text.text).toBe('New User Signup');
            expect(message.blocks[1].fields[0].text).toContain('John Doe');
            expect(message.blocks[1].fields[1].text).toContain('test@example.com');
            expect(message.blocks[2].fields[0].text).toContain('Test Company');
            expect(message.blocks[2].fields[1].text).toContain('https://hubspot.com/contact/123');
        });

        it('should handle missing data gracefully', () => {
            // GIVEN
            const user = {
                email: 'test@example.com'
            };

            // WHEN
            const message = SlackService.formatMessage({ user });

            // THEN
            expect(message.blocks[1].fields[0].text).toContain('test@example.com');
            expect(message.blocks[2].fields[0].text).toContain('No Company Name');
            expect(message.blocks[2].fields[1].text).toContain('Not created');
        });
    });

    describe('sendMessage', () => {
        it('should send message successfully with tenant details', async () => {
            // GIVEN
            const user = {
                email: 'test@example.com',
                name: 'John Doe',
                tenantId: 'test-tenant-id'
            };
            const hubspotContactUrl = 'https://hubspot.com/contact/123';
            const mockTenantName = 'Test Company';
            
            vi.spyOn(FronteggUtil, 'getTenantDetails').mockResolvedValueOnce({ name: mockTenantName });
            vi.spyOn(axios, 'post').mockResolvedValueOnce({ data: { ok: true } });
            vi.spyOn(ErrorUtil, 'logError');

            // WHEN
            await SlackService.sendMessage(user, hubspotContactUrl);

            // THEN
            expect(FronteggUtil.getTenantDetails).toHaveBeenCalledWith(user.tenantId);
            expect(axios.post).toHaveBeenCalledWith(
                config.slack.apiUrl,
                expect.objectContaining({
                    blocks: expect.arrayContaining([
                        expect.objectContaining({
                            text: expect.objectContaining({
                                text: 'New User Signup'
                            })
                        })
                    ])
                })
            );
            expect(ErrorUtil.logError).not.toHaveBeenCalled();
        });

        it('should handle missing tenant ID', async () => {
            // GIVEN
            const user = {
                email: 'test@example.com',
                name: 'John Doe'
            };
            const hubspotContactUrl = 'https://hubspot.com/contact/123';
            
            vi.spyOn(axios, 'post').mockResolvedValueOnce({ data: { ok: true } });
            vi.spyOn(ErrorUtil, 'logError');

            // WHEN
            await SlackService.sendMessage(user, hubspotContactUrl);

            // THEN
            expect(FronteggUtil.getTenantDetails).not.toHaveBeenCalled();
            expect(axios.post).toHaveBeenCalledWith(
                config.slack.apiUrl,
                expect.objectContaining({
                    blocks: expect.arrayContaining([
                        expect.objectContaining({
                            fields: expect.arrayContaining([
                                expect.objectContaining({
                                    text: expect.stringContaining('No Company Name')
                                })
                            ])
                        })
                    ])
                })
            );
            expect(ErrorUtil.logError).not.toHaveBeenCalled();
        });

        it('should log error on API failure', async () => {
            // GIVEN
            const user = {
                email: 'test@example.com',
                name: 'John Doe',
                tenantId: 'test-tenant-id'
            };
            const hubspotContactUrl = 'https://hubspot.com/contact/123';
            const error = new Error('API Error');
            
            vi.spyOn(FronteggUtil, 'getTenantDetails').mockResolvedValueOnce({ name: 'Test Company' });
            vi.spyOn(axios, 'post').mockRejectedValueOnce(error);
            vi.spyOn(ErrorUtil, 'logError');

            // WHEN
            await SlackService.sendMessage(user, hubspotContactUrl);

            // THEN
            expect(ErrorUtil.logError).toHaveBeenCalledWith('Error posting to Slack:', error.response?.data || error.message);
        });
    });
}); 