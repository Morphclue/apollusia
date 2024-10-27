# 🃏 JestTesting Guide for Apollusia

This guide provides a comprehensive overview of Jest unit testing in our NX monorepo for the Apollusia project. It's designed to help developers write and run effective unit tests for both frontend and backend components.

## 📋 Table of Contents

1. [Setup](#-setup)
2. [Writing Tests](#-writing-tests)
3. [Running Tests](#-running-tests)
4. [Best Practices](#-best-practices)
5. [Mocking](#-mocking)
6. [Troubleshooting](#-troubleshooting)

## 💿 Setup

1. Ensure you have the project set up locally. If not, follow the [Setup Guide](SETUP GUIDE.md).
    
2. Jest should already be installed as part of the project dependencies. If not, run:
    
    ```
    pnpm add -D jest @types/jest @nrwl/jest
    ```

3. For Angular components, also install:

```shellscript
pnpm add -D @angular-devkit/build-angular
```


4. Update the `jest.config.ts` file in each project directory if needed:

```typescript
import type { Config } from 'jest';

const config: Config = {
  displayName: 'frontend',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/apps/frontend',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};

export default config;
```


## ✍️ Writing Tests

### Frontend (Angular) Tests

1. Create a new test file next to the component or service you want to test, e.g., `login.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: jest.Mocked<AuthService>;

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login method on form submission', () => {
    component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
    component.onSubmit();
    expect(authServiceMock.login).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should show error message on invalid form submission', () => {
    component.loginForm.setValue({ email: 'invalid-email', password: '' });
    component.onSubmit();
    expect(authServiceMock.login).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Please enter a valid email and password.');
  });
});
```




### Backend (NestJS) Tests

1. Create a new test file next to the service or controller you want to test, e.g., `auth.service.spec.ts`:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersServiceMock: jest.Mocked<UsersService>;
  let jwtServiceMock: jest.Mocked<JwtService>;

  beforeEach(async () => {
    usersServiceMock = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    jwtServiceMock = {
      sign: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
      usersServiceMock.findOne.mockResolvedValue(user);

      const result = await authService.validateUser('test@example.com', 'password123');
      expect(result).toEqual({ id: 1, email: 'test@example.com' });
    });

    it('should return null when user is not found', async () => {
      usersServiceMock.findOne.mockResolvedValue(null);

      const result = await authService.validateUser('test@example.com', 'password123');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return JWT token when login is successful', async () => {
      const user = { id: 1, email: 'test@example.com' };
      jwtServiceMock.sign.mockReturnValue('mock-jwt-token');

      const result = await authService.login(user);
      expect(result).toEqual({ access_token: 'mock-jwt-token' });
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({ email: user.email, sub: user.id });
    });
  });
});
```




## 🏃‍♂️ Running Tests

1. To run tests for a specific project:

```shellscript
nx test frontend
```

or

```shellscript
nx test backend
```


2. To run tests with coverage:

```shellscript
nx test frontend --coverage
```


3. To run tests in watch mode:

```shellscript
nx test frontend --watch
```




## 💡 Best Practices

1. **Test structure**: Use `describe` blocks to group related tests and `it` blocks for individual test cases.
2. **Naming conventions**: Use clear and descriptive names for your test cases.
3. **Arrange-Act-Assert**: Structure your tests using the AAA pattern:
	- Arrange: Set up the test data and conditions
	- Act: Perform the action being tested
	- Assert: Check the results
4. **Isolation**: Ensure each test is independent and doesn't rely on the state from other tests.
5. **Coverage**: Aim for high test coverage, but focus on critical paths and edge cases.
6. **Avoid test duplication**: Use `beforeEach` and `afterEach` hooks to set up and tear down common test conditions.


## 🎭 Mocking

1. **Jest mocks**: Use `jest.fn()` to create mock functions:

```typescript
const mockFunction = jest.fn();
mockFunction.mockReturnValue('mocked value');
```


2. **Mocking modules**: Use `jest.mock()` to mock entire modules:

```typescript
jest.mock('../services/api.service');
import { ApiService } from '../services/api.service';
const mockApiService = ApiService as jest.Mocked<typeof ApiService>;
```


3. **Mocking HTTP requests**: Use `jest-fetch-mock` for frontend tests or `supertest` for backend tests.


## 🐛 Troubleshooting

1. **Tests not running**: Ensure the `jest.config.ts` file is properly configured for each project.
2. **Mocks not working**: Check that you're mocking at the correct level (function, module, or dependency injection).
3. **Asynchronous test failures**: Use `async/await` or `done` callback for asynchronous tests.
4. **Coverage reports not generating**: Verify the `coverageDirectory` in `jest.config.ts` and ensure you're using the `--coverage` flag.


For more detailed information, refer to the [Jest Documentation](https://jestjs.io/docs/getting-started) and [NX Testing Guide](https://nx.dev/recipes/jest).

Happy testing! 🎉 
