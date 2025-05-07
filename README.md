# Frontegg Webhook Handler

A Node.js application that handles Frontegg webhooks for user events, integrating with HubSpot and Slack.

## Features

- Handles Frontegg user events (signup, activation)
- Creates HubSpot contacts for new users
- Sends Slack notifications for user activities
- Assigns users to tenants with appropriate roles
- Secure webhook authentication

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Vercel CLI (`npm i -g vercel`)
- Frontegg account and API credentials
- HubSpot API key (optional)
- Slack webhook URL (optional)
- Postman (for testing)

## Configuration

The application uses different environment files for different environments:

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontegg
```

2. Install dependencies:
```bash
npm install
```

## Development

### Running with Vercel Dev

1. Start the Vercel development server:
```bash
vercel dev
```

The server will start on `http://localhost:3000` by default.

## Testing

The project uses Vitest for testing. Tests are located in the `api/__tests__` directory.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- `api/__tests__/webhook.test.js` - Webhook handler tests
- `api/__tests__/utils/` - Utility class tests
- `api/__tests__/services/` - Service class tests

### Test Environment

The tests use a dedicated test environment configuration:
1. Environment variables are loaded from `.env.test`
2. All external API calls are mocked to use local mock endpoints
3. Console methods are mocked to prevent test output pollution
4. The test environment is automatically set when running tests

### Mocking External Services

The tests use Vitest's mocking capabilities to mock external API calls:

- Frontegg API calls are mocked in `api/__tests__/utils/fronteggUtil.test.js`
- HubSpot API calls are mocked in `api/__tests__/services/hubspotService.test.js`
- Slack API calls are mocked in `api/__tests__/services/slackService.test.js`

Example of mocking an API call:
```javascript
import { vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');
axios.post.mockResolvedValue({ data: { accessToken: 'mock-token' } });
```

## API Endpoints

### Webhook Endpoint

```
POST /api/webhook
```

Headers:
- `x-webhook-secret`: Webhook authentication token

Body:
```json
{
  "eventKey": "USER_SIGNED_UP",
  "eventContext": {
    "tenantId": "tenant-id"
  },
  "user": {
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## Error Handling

The application uses a centralized error handling system (`ErrorUtil`) that provides consistent error responses:

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 405 Method Not Allowed
- 500 Internal Server Error

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
