const config = {
    frontegg: {
        authUrl: process.env.FRONTEGG_AUTH_URL,
        tenantApiUrl: process.env.FRONTEGG_TENANT_API_URL,
        userTenantUrl: process.env.FRONTEGG_USER_TENANT_URL,
        vendorUrl: process.env.FRONTEGG_VENDOR_URL,
        clientEmail: process.env.CLIENT_EMAIL,
        clientPassword: process.env.CLIENT_PASSWORD,
        clientId: process.env.FRONTEGG_CLIENT_ID,
        clientApiKey: process.env.FRONTEGG_CLIENT_SECRET,
        demoRoleId: process.env.DEMO_ROLE_ID,
        demoTenantId: process.env.DEMO_TENANT_ID,
    },
    hubspot: {
        accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
        contactApiUrl: process.env.HUBSPOT_CONTACT_API_URL,
        contactAppUrl: process.env.HUBSPOT_CONTACT_APP_URL,
    },
    slack: {
        apiUrl: process.env.SLACK_API_URL
    },
    webhook: {
        secret: process.env.WEBHOOK_SECRET,
    },
    events: {
        USER_SIGNED_UP: 'frontegg.user.signedUp',
        USER_ACTIVATED: 'frontegg.user.activated',
    },
};

module.exports = config; 