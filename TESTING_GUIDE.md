# Testing Guide for Chaamo App

This guide covers the testing setup, structure, and best practices for the Chaamo React Native app.

## 🧪 Testing Setup

- **All dependencies are pre-installed**: Jest, @testing-library/react-native, react-test-renderer, and @types/jest are already included in the repo.
- **Configuration**: See `jest.config.js` and `jest.setup.js` for test and environment setup.

## 📁 Test Structure

- **Unit tests** are colocated in `__tests__` folders next to their respective modules:
  - `components/atoms/__tests__/*.test.tsx` — Atom component unit tests
  - `components/molecules/__tests__/*.test.tsx` — Molecule component unit tests
  - `components/organisms/__tests__/*.test.tsx` — Organism component unit tests
  - `hooks/__tests__/*.test.ts` — Custom hook unit tests
  - `utils/__tests__/*.test.ts` — Utility function unit tests
  - `stores/__tests__/*.test.ts` — Zustand store unit tests
- **No screen-level or E2E tests** are present yet (e.g., Detox/Playwright or integration tests for screens).

## 🚀 Running Tests

See the [README](./README.md) for quick commands. Common examples:

```bash
# Run all tests
yarn test
# Watch mode
yarn test:watch
# Coverage report
yarn test:coverage
```

## 📊 Coverage & Thresholds

- **Coverage thresholds** are enforced at 90% for branches, functions, lines, and statements (see `jest.config.js`).
- The repo currently achieves high coverage for all hooks, utils, stores, and most components.
- Coverage reports are output to `coverage/` after running `yarn test:coverage`.

## 📝 Test Patterns & Best Practices

- **Test behavior, not implementation**: Focus on user interactions and outcomes.
- **Use meaningful test descriptions**: Describe what the test checks, not just what it renders.
- **Mock external dependencies**: Navigation, AsyncStorage, and other side effects are mocked in `jest.setup.js` or per test.
- **Test edge cases and error states**: Cover all branches, including error and empty states.
- **Keep tests simple and focused**: Each test should check one thing.

## 🔧 Example Test

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../../../components/atoms/Button';

describe('Button', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<Button title="Test Button" />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPress} />
    );
    fireEvent.press(getByText('Test Button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

## 🚨 Troubleshooting

- **Icon, navigation, and AsyncStorage** are mocked in `jest.setup.js`.
- If you see errors related to these, check the setup file or mock them in your test.
- For more advanced patterns, see the [README](./README.md) and the codebase for up-to-date examples.

## 📈 Next Steps

- Add integration/screen-level tests for user flows.
- Add E2E tests for critical flows (sign-in, navigation, etc.).
- Continue to maintain high coverage and follow best practices as the codebase evolves.
