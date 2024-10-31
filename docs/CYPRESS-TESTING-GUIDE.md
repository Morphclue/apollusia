# 🌿 Cyprss Testing Guide for Apollusia

## 📋 Table of Contents

- [🛠️ Setup](#-setup)
- [✍️ Writing Tests](#-writing-tests)
- [🏃 Running Tests](#-running-tests)
- [💡 Best Practices](#-best-practices)
- [🐛 Troubleshooting](#-troubleshooting)

This guide provides a comprehensive overview of Cypress end-to-end testing in our NX monorepo for the Apollusia project. While Cypress is already installed as part of the project dependencies, the following steps are designed to support new additions to the monorepo or fresh setups.



## 💿 Setup

1. Ensure you have the project set up locally. If not, follow the [setup guide](SETUP_GUIDE.md)
    
2. Cypress should already be installed as part of the project dependencies. **If not**, run:
    
```bash
pnpm add -D cypress @nrwl/cypress    
```
    
3. Generate a new Cypress e2e project in your NX workspace: To add a new Cypress E2E project within the monorepo, generate it in your NX workspace by specifying the desired application (in this example, `frontend`):

``` shellscript
nx g @nrwl/cypress:cypress-project frontend-e2e --project=frontend
```

4. Update the `cypress.config.ts` file in the `frontend-e2e` directory:

```typescript
import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    baseUrl: 'http://localhost:4000',
  },
});
```



## ✒️ Writing Tests

1. Navigate to the e2e project directory:

```plaintext
apps/frontend-e2e/src/e2e
```

2. Create a new test file, e.g., `login.cy.ts`:

```typescript
describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.get('[data-testid="login-form"]').should('be.visible');
    cy.get('[data-testid="email-input"]').should('exist');
    cy.get('[data-testid="password-input"]').should('exist');
    cy.get('[data-testid="login-button"]').should('exist');
  });

  it('should show error for invalid credentials', () => {
    cy.get('[data-testid="email-input"]').type('invalid@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="error-message"]').should('be.visible').and('contain', 'Invalid credentials');
  });

  it('should successfully log in with valid credentials', () => {
    cy.get('[data-testid="email-input"]').type('user@example.com');
    cy.get('[data-testid="password-input"]').type('correctpassword');
    cy.get('[data-testid="login-button"]').click();
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="welcome-message"]').should('contain', 'Welcome, User');
  });
});
```


3. Use Cypress commands to interact with your application and make assertions.


## 🏃 Running Tests

1. To run tests for the frontend project:

```shellscript
nx e2e frontend-e2e
```


2. To run tests in headless mode:

```shellscript
nx e2e frontend-e2e --headless
```

3. To open the Cypress Test Runner:

```shellscript
nx e2e frontend-e2e --watch
```


## 💡 Best Practices

1. **Use data-testid attributes**: Add `data-testid` attributes to elements in your Angular components for more stable test selectors.

```html
<button data-testid="submit-button">Submit</button>
```

```typescript
cy.get('[data-testid="submit-button"]').click();
```

2. **Organize tests logically**: Group related tests using `describe` blocks and use clear, descriptive test names.
3. **Use custom commands**: Create custom Cypress commands for common operations, such as login:

```typescript
// In cypress/support/commands.ts
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
});

// In your test file
cy.login('user@example.com', 'password123');
```

4. **Mock API responses**: Use `cy.intercept()` to mock API responses for consistent test results:

```typescript
cy.intercept('GET', '/api/users', { fixture: 'users.json' }).as('getUsers');
cy.visit('/users');
cy.wait('@getUsers');
```

5. **Use environment variables**: Store sensitive data or configuration in Cypress environment variables:

```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    baseUrl: 'http://localhost:4000',
    env: {
      apiUrl: 'http://localhost:3000',
      adminUser: 'admin@example.com',
      adminPassword: 'securepassword',
    },
  },
});

// In your test file
cy.visit(Cypress.env('apiUrl') + '/users');
cy.login(Cypress.env('adminUser'), Cypress.env('adminPassword'));
```


6. **Implement page objects (optionally)**: Use the page object pattern to encapsulate page-specific selectors and actions:

```typescript
// pages/login.page.ts
class LoginPage {
  visit() {
    cy.visit('/login');
  }

  getEmailInput() {
    return cy.get('[data-testid="email-input"]');
  }

  getPasswordInput() {
    return cy.get('[data-testid="password-input"]');
  }

  getLoginButton() {
    return cy.get('[data-testid="login-button"]');
  }

  login(email: string, password: string) {
    this.getEmailInput().type(email);
    this.getPasswordInput().type(password);
    this.getLoginButton().click();
  }
}

export const loginPage = new LoginPage();

// In your test file
import { loginPage } from '../pages/login.page';

describe('Login', () => {
  it('should log in successfully', () => {
    loginPage.visit();
    loginPage.login('user@example.com', 'password123');
    cy.url().should('include', '/dashboard');
  });
});
```




## 🐛 Troubleshooting

1. **Tests are flaky**: Use `cy.wait()` for asynchronous operations or increase the default command timeout in `cypress.config.ts`:

```typescript
export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    defaultCommandTimeout: 10000, // Increase timeout to 10 seconds
  },
});
```


2. **Element not found**: Check if the element is in the DOM and visible. Use `cy.contains()` for text-based selection or add `data-testid` attributes.
3. **Cross-origin errors**: Configure `chromeWebSecurity` in `cypress.config.ts` or use `cy.origin()` for multi-domain testing:

```typescript
export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    chromeWebSecurity: false, // Disable for cross-origin testing
  },
});
```


4. **Handling authentication**: Use `cy.session()` to preserve login state across tests:

```typescript
Cypress.Commands.add('loginByApi', (email: string, password: string) => {
  cy.request('POST', `${Cypress.env('apiUrl')}/login`, { email, password })
    .then((response) => {
      window.localStorage.setItem('authToken', response.body.token);
    });
});

beforeEach(() => {
  cy.session('user', () => {
    cy.loginByApi('user@example.com', 'password123');
  });
});
```


For more detailed information, refer to the [Cypress Documentation](https://docs.cypress.io/).

Happy testing! 🎉
