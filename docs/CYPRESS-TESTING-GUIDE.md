# ✍️ Writing Tests

## Structure Your Test

Use the following structure to write your tests:

```javascript
describe('Your Feature Title', () => {
  beforeEach(() => {
    // Code to run before each test, like visiting a page
    cy.visit('http://localhost:4000/your-page');
  });

  it('should display the expected element', () => {
    // Code to assert the presence of an element
    cy.get('selector').should('be.visible');
  });

  it('should perform an action and validate the result', () => {
    // Code to interact with elements and assert outcomes
    cy.get('selector').click();
    cy.url().should('include', '/expected-url');
  });
});
```

## Writing Tests for Existing Features

For existing features, you can create tests similarly, but make sure to cover the critical paths and scenarios. Identify key user flows and write tests that validate their functionality.

## Use Cypress Commands

Cypress provides many built-in commands to interact with the application. Here are some commonly used commands:

* `cy.get(selector)`: Get an element by its selector
* `cy.click()`: Click on an element
* `cy.type(text)`: Type text into an input field
* `cy.url()`: Get the current URL

Refer to the Cypress API documentation for more commands and usage examples.

# 🏃 Running Tests

## Open Cypress Test Runner

Run the following command to open the Cypress Test Runner:

```bash
pnpm cypress open
```

## Run Tests Headlessly

To run tests in a headless mode, use:

```bash
pnpm cypress run
```

## Select the Test to Run

In the Test Runner, select your test file to execute. Cypress will automatically reload your tests when you make changes.

# 💡 Best Practices

* **Write Clear and Concise Tests**: Ensure that your test descriptions clearly explain what each test does
* **Keep Tests Isolated**: Tests should be independent; avoid dependencies on other tests' results
* **Use Fixtures for Test Data**: Store static data in fixtures to make your tests cleaner and easier to maintain
* **Utilize Custom Commands**: Create custom commands for repetitive actions to keep your tests DRY (Don't Repeat Yourself)
* **Cover Critical Paths**: Ensure that your tests for existing features cover the critical user flows and edge cases

# 🐛 Troubleshooting

* **Common Errors**: Check the console for error messages if tests fail
* **Debugging**: Use `cy.debug()` or `cy.pause()` in your tests to help with debugging
* **Network Issues**: Ensure that the application is running locally at the specified base URL

For more information, refer to the Cypress Troubleshooting Guide.
