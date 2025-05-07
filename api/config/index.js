const config = {
    frontegg: {
        authUrl: process.env.FRONTEGG_AUTH_URL,
        tenantApiUrl: process.env.FRONTEGG_TENANT_API_URL,
        userTenantUrl: process.env.FRONTEGG_USER_TENANT_URL,
        clientEmail: process.env.CLIENT_EMAIL,
        clientPassword: process.env.CLIENT_PASSWORD,
        demoRoleId: process.env.DEMO_ROLE_ID,
        demoTenantId: process.env.DEMO_TENANT_ID,
    },
    hubspot: {
        accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
        apiUrl: process.env.HUBSPOT_API_URL,
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