
# End-to-End Tests for Ekowest TV

This directory contains comprehensive end-to-end tests for the entire Ekowest TV platform using Cucumber with TypeScript and Playwright.

## Test Structure

```
tests/
├── features/          # Gherkin feature files
│   ├── auth.feature
│   ├── home.feature
│   ├── watch.feature
│   ├── community.feature
│   ├── profile.feature
│   └── rewards.feature
├── steps/            # Step definitions
│   ├── auth.steps.ts
│   ├── home.steps.ts
│   ├── watch.steps.ts
│   ├── community.steps.ts
│   ├── profile.steps.ts
│   └── rewards.steps.ts
├── setup/           # Test setup and teardown
│   └── hooks.ts
└── fixtures/        # Test data and files
    ├── test-image.jpg
    └── test-video.mp4
```

## Features Covered

1. Authentication
   - Sign up
   - Login
   - Logout

2. Home Page
   - Video browsing
   - Category navigation
   - Search functionality
   - Video carousel interaction

3. Video Watching
   - Video playback
   - Player controls
   - Watch2Earn functionality
   - Video recommendations

4. Community
   - Post creation
   - Image uploads
   - Post interactions (like, reply)
   - Post management (pin, delete)

5. Profile Management
   - Profile updates
   - Avatar management
   - Watch history

6. Rewards System
   - Points tracking
   - Watch time tracking
   - Rewards redemption

## Prerequisites

1. Node.js installed (v16 or higher)
2. Project dependencies installed:
   ```bash
   npm install
   ```
3. Local development server running:
   ```bash
   npm run dev
   ```
4. Supabase local instance or test environment configured

## Running Tests

1. Run all tests:
   ```bash
   npm run test:e2e
   ```

2. Run specific feature:
   ```bash
   npm run test:e2e -- --tags @auth
   ```

3. Run in debug mode:
   ```bash
   DEBUG=true npm run test:e2e
   ```

4. Generate test report:
   ```bash
   npm run test:e2e:report
   ```

## Test Data Management

- Test data is automatically created before tests run
- Cleanup happens after each test suite
- Isolated test environment prevents interference with production data
- Test users and content are clearly marked for easy identification

## Debugging

1. Visual Debugging:
   - Set DEBUG=true to run tests with browser visible
   - Tests will run slower but you can see what's happening

2. Logs and Reports:
   - Check test-report.html for detailed results
   - Console logs provide real-time feedback
   - Screenshots are saved on failures

3. Common Issues:
   - Authentication errors: Check Supabase configuration
   - Timing issues: Adjust wait times
   - Selector failures: Update data-testid attributes

## CI/CD Integration

Tests are integrated into the CI/CD pipeline:
- Run on pull requests
- Run before deployment
- Generate reports for review

## Contributing

1. Adding New Tests:
   - Create feature file in Gherkin syntax
   - Implement step definitions
   - Add necessary fixtures
   - Update README if needed

2. Best Practices:
   - Use data-testid for selectors
   - Keep scenarios focused and atomic
   - Clean up test data
   - Document complex scenarios

3. Code Style:
   - Follow existing patterns
   - Use type annotations
   - Add comments for clarity
   - Keep step definitions reusable

## Maintenance

Regular maintenance tasks:
1. Update test data
2. Review and update selectors
3. Check for deprecated patterns
4. Update dependencies
5. Review test coverage

## Security

- Test credentials are never committed
- Sensitive data is managed via environment variables
- Test environment is isolated
- Clean up sensitive test data

For more detailed information about specific features or test scenarios, refer to the individual feature files and their corresponding step definitions.
