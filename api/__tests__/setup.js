import { vi } from 'vitest';

// Mock environment variables
process.env.FRONTEGG_AUTH_URL = 'https://test.frontegg.com/oauth/resources/auth/v1';
process.env.FRONTEGG_TENANT_API_URL = 'https://test.frontegg.com/oauth/resources/tenants/v1';
process.env.FRONTEGG_USER_TENANT_URL = 'https://test.frontegg.com/oauth/resources/tenants/v1/users';
process.env.FRONTEGG_VENDOR_URL = 'https://test.frontegg.com/oauth/frontegg/auth/vendor';
process.env.CLIENT_EMAIL = 'test@example.com';
process.env.CLIENT_PASSWORD = 'test-password';
process.env.FRONTEGG_CLIENT_ID = 'test-client-id';
process.env.FRONTEGG_CLIENT_SECRET = 'test-client-secret';
process.env.DEMO_ROLE_ID = 'test-role-id';
process.env.DEMO_TENANT_ID = 'test-tenant-id';
process.env.HUBSPOT_ACCESS_TOKEN = 'test-hubspot-token';
process.env.HUBSPOT_CONTACT_API_URL = 'https://api.hubapi.com/crm/v3/objects/contacts';
process.env.SLACK_API_URL = 'https://hooks.slack.com/services/test';
process.env.WEBHOOK_SECRET = 'test-webhook-secret';

// Mock console methods
global.console = {
    ...console,
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
}; 

