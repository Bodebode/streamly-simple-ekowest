# Ekowest TV Project

## Testing Documentation

This project uses Playwright with Cucumber for Behavior-Driven Development (BDD) testing. The test suite includes end-to-end tests, integration tests, and feature tests written in Gherkin syntax.

### Prerequisites

Before running the tests, ensure you have:

1. Node.js installed (v16 or higher)
2. npm installed
3. The project dependencies installed by running:
```bash
npm install
```

### Test Structure

The tests are organized as follows:

```
tests/
├── features/          # Gherkin feature files
│   └── video-playback.feature
├── setup/            # Test setup and configuration
│   └── hooks.ts
└── steps/            # Step definitions
    └── video-playback.steps.ts
```

### Running Tests

You can run the tests in several ways:

1. **Run all tests**
```bash
npx cucumber-js
```

2. **Run specific feature**
```bash
npx cucumber-js tests/features/video-playback.feature
```

3. **Run with tags**
```bash
npx cucumber-js --tags "@smoke"
```

### Debug Mode

To run tests in debug mode with the browser visible:

```bash
DEBUG=true npx cucumber-js
```

### Test Reports

Test reports are generated automatically after each run. You can find them in:
```
test-results/
└── report.html
```

### Writing New Tests

1. Create a new feature file in `tests/features/`
2. Write your scenarios in Gherkin syntax
3. Implement step definitions in `tests/steps/`

Example feature file:
```gherkin
Feature: Video Playback
  As a user
  I want to watch videos on the platform
  So that I can enjoy the content

  Scenario: User plays a video
    Given I am on the home page
    When I click on a video thumbnail
    Then the video should start playing
```

### Configuration Files

- `playwright.config.ts`: Playwright configuration
- `cucumber.js`: Cucumber configuration
- `tests/tsconfig.json`: TypeScript configuration for tests

### Continuous Integration

Tests are automatically run in the CI pipeline. The configuration can be found in the project's CI/CD configuration files.

### Troubleshooting

If you encounter issues:

1. Ensure all dependencies are installed
2. Clear the test cache:
```bash
npx playwright clear-cache
```
3. Update Playwright browsers:
```bash
npx playwright install
```

### Best Practices

1. Write descriptive feature files that focus on business value
2. Keep step definitions small and reusable
3. Use tags to organize tests (@smoke, @regression, etc.)
4. Add comments for complex test scenarios
5. Follow the Given-When-Then pattern

## Project Setup

For information about setting up and running the main project, please refer to the [Project Documentation](https://docs.lovable.dev).

## Contributing

When contributing new tests:

1. Follow the existing test structure
2. Add appropriate tags
3. Include documentation in the feature files
4. Test both positive and negative scenarios
5. Ensure tests are deterministic

## License

This project is licensed under the MIT License - see the LICENSE file for details.