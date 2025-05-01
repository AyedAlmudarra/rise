# Unit Test Case Report: AuthLogin Input Handling

## Test Case Title
[UNIT-AUTHLOGIN-002] should allow typing into email and password fields

## Test Case ID
UNIT-AUTHLOGIN-002

## Requirement ID
(Implicit requirement for Login functionality)

## Author
Ayed

## Description
Verifies that the user can type into the email and password input fields and that the input values are correctly reflected in the DOM.

## Test Steps
1.  Set up `userEvent` for simulating user interactions.
2.  Render the `AuthLogin` component within a `BrowserRouter`.
3.  Locate the email input field via its label ("Email Address").
4.  Locate the password input field via its label ("Password").
5.  Define test strings for email and password.
6.  Simulate typing the test email string into the email input using `userEvent.type()`.
7.  Assert that the `value` attribute of the email input element equals the typed email string.
8.  Simulate typing the test password string into the password input using `userEvent.type()`.
9.  Assert that the `value` attribute of the password input element equals the typed password string.

## Test Script
```typescript
// Test case from frontend/src/views/authentication/authforms/AuthLogin.test.tsx

test('[UNIT-AUTHLOGIN-002] should allow typing into email and password fields', async () => {
  const user = userEvent.setup(); // Setup userEvent
  renderComponent();

  const emailInput = screen.getByLabelText(/Email Address/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const testEmail = 'test@example.com';
  const testPassword = 'password123';

  // Simulate typing into email field
  await user.type(emailInput, testEmail);
  expect(emailInput).toHaveValue(testEmail);

  // Simulate typing into password field
  await user.type(passwordInput, testPassword);
  expect(passwordInput).toHaveValue(testPassword);
});
```

## Expected Result
The test passes, confirming that user input is correctly processed and reflected by the email and password fields. 