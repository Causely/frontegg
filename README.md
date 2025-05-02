# Frontegg Webhook Service

This service handles webhook events from Frontegg, providing integration with HubSpot and user tenant management functionality.

## Features

- Webhook authentication and validation
- Automatic HubSpot contact creation for new user signups
- User tenant assignment for activated users
- Secure token-based authentication

## Prerequisites

- Node.js environment
- Frontegg account and credentials
- HubSpot account and access token (optional)
- Environment variables configured (see Setup section)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   ```
   WEBHOOK_SECRET=your_webhook_secret
   FRONTEGG_AUTH_URL=your_frontegg_auth_url
   CLIENT_EMAIL=your_frontegg_email
   CLIENT_PASSWORD=your_frontegg_password
   FRONTEGG_USER_TENANT_URL=your_frontegg_tenant_url
   DEMO_ROLE_ID=your_demo_role_id
   DEMO_TENANT_ID=your_demo_tenant_id
   HUBSPOT_ACCESS_TOKEN=your_hubspot_token (optional)
   ```

## Webhook Events Handled

### User Signup (`frontegg.user.signedUp`)
- Creates a new contact in HubSpot (if HubSpot integration is configured)
- Captures user's email, first name, and last name

### User Activation (`frontegg.user.activated`)
- Assigns the user to a specific tenant
- Applies the configured demo role
- Skips invitation email
